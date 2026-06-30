"use client"
import { useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useCartStore } from './useCart'

export function useCartSync(user: any) {
  const supabase = createClient()
  const isSyncing = useRef(false)

  useEffect(() => {
    if (!user) return

    const syncCart = async () => {
      if (isSyncing.current) return
      isSyncing.current = true

      try {
        const localItems = useCartStore.getState().items

        // Fetch DB cart
        let { data: cart } = await supabase.from('carts').select('id').eq('user_id', user.id).single()
        
        if (!cart) {
          // Create cart if not exists
          const { data: newCart } = await supabase.from('carts').insert({ user_id: user.id }).select('id').single()
          cart = newCart
        }

        if (!cart) throw new Error('Could not get or create cart')

        const { data: dbItems } = await supabase
          .from('cart_items')
          .select('id, menu_item_id, quantity, menu_items(*)')
          .eq('cart_id', cart.id)

        // Merge logic
        const mergedMap = new Map()

        // 1. Add DB items to map
        dbItems?.forEach((dbItem: any) => {
          mergedMap.set(dbItem.menu_item_id, {
            menu_item: dbItem.menu_items,
            quantity: dbItem.quantity
          })
        })

        // 2. Add Local items to map (merging quantities)
        let hasLocalChanges = false
        for (const local of localItems) {
          const existing = mergedMap.get(local.menu_item.id)
          if (existing) {
            // Only merge if the DB and local don't match, or just take DB if we assume local was already synced?
            // A simple approach: if local has items, and we just logged in, add them.
            // But wait, this runs on every mount. We don't want to double count on refresh.
            // Let's just trust DB as source of truth if we already synced.
            // How do we know if we just logged in vs refreshed? LocalStorage still has it.
            // Let's use a simpler approach: Zustand stores a `synced: boolean`? No, let's just clear local state 
            // if we use DB as source of truth. But wait, user wanted "merge guest cart".
            // Let's check if there are local items that are NOT in DB. If so, add them to DB.
            if (!existing) {
              mergedMap.set(local.menu_item.id, local)
              hasLocalChanges = true
            }
          } else {
            mergedMap.set(local.menu_item.id, local)
            hasLocalChanges = true
          }
        }

        const finalItems = Array.from(mergedMap.values())

        // Update DB if there were local items not in DB
        if (hasLocalChanges) {
          const upserts = finalItems.map(item => ({
            cart_id: cart.id,
            menu_item_id: item.menu_item.id,
            quantity: item.quantity
          }))
          
          await supabase.from('cart_items').upsert(upserts, { onConflict: 'cart_id,menu_item_id' })
        }

        // Update local store
        useCartStore.setState({ items: finalItems })

      } catch (err) {
        console.error("Cart sync failed:", err)
      } finally {
        isSyncing.current = false
      }
    }

    syncCart()

    // Subscribe to Zustand changes and push to DB
    const unsub = useCartStore.subscribe((state, prevState) => {
      if (isSyncing.current) return // Prevent loop
      
      // We only care if items changed
      if (state.items !== prevState.items) {
        // Debounce or just push
        const pushToDb = async () => {
          try {
            const { data: cart } = await supabase.from('carts').select('id').eq('user_id', user.id).single()
            if (cart) {
              // Delete removed items
              const currentIds = state.items.map(i => i.menu_item.id)
              await supabase.from('cart_items').delete().eq('cart_id', cart.id).not('menu_item_id', 'in', `(${currentIds.join(',')})`)
              
              // Upsert all
              if (state.items.length > 0) {
                 const upserts = state.items.map(item => ({
                  cart_id: cart.id,
                  menu_item_id: item.menu_item.id,
                  quantity: item.quantity
                }))
                await supabase.from('cart_items').upsert(upserts, { onConflict: 'cart_id,menu_item_id' })
              }
            }
          } catch (e) {
            console.error('Failed to update remote cart', e)
          }
        }
        pushToDb()
      }
    })

    return () => unsub()

  }, [user, supabase])
}
