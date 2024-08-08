'use client';
import React, { useState, useEffect } from 'react';
import {
  collection,
  addDoc,
  query,
  onSnapshot,
  updateDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { db } from './firebase';

export default function Home() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', quantity: '' });

  // Add item to database
  const addItem = async (e) => {
    e.preventDefault();
    if (newItem.name !== '' && newItem.quantity !== '') {
      await addDoc(collection(db, 'items'), {
        name: newItem.name.trim(),
        quantity: parseInt(newItem.quantity, 10),
      });
      setNewItem({ name: '', quantity: '' });
    }
  };

  // Read items from database
  useEffect(() => {
    const q = query(collection(db, 'items'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let itemsArr = [];

      querySnapshot.forEach((doc) => {
        itemsArr.push({ ...doc.data(), id: doc.id });
      });
      setItems(itemsArr);
    });
    return () => unsubscribe();
  }, []);

  // Update item quantity in database
  const updateItemQuantity = async (id, quantity) => {
    if (quantity <= 0) {
      await deleteDoc(doc(db, 'items', id));
    } else {
      await updateDoc(doc(db, 'items', id), {
        quantity: quantity,
      });
    }
  };

  return (
    <main className='flex min-h-screen flex-col items-center justify-between sm:p-24 p-4'>
      <div className='z-10 w-full max-w-3xl items-center justify-between font-mono text-sm'>
        <h1 className='text-4xl p-4 text-center'>Welcome to Pantry Tracker</h1>
        <div className='bg-slate-800 p-4 rounded-lg mb-4'>
          <form className='grid grid-cols-6 items-center text-black'>
            <input
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              className='col-span-3 p-3 border'
              type='text'
              placeholder='Enter Item'
            />
            <input
              value={newItem.quantity}
              onChange={(e) =>
                setNewItem({ ...newItem, quantity: e.target.value })
              }
              className='col-span-2 p-3 border mx-3'
              type='number'
              placeholder='Enter Quantity'
            />
            <button
              onClick={addItem}
              className='text-white bg-red-600 rounded-lg hover:bg-red-700 p-2 text-xl'
              type='submit'
            >
              ADD
            </button>
          </form>
        </div>
        <div className='bg-slate-800 p-4 rounded-lg mx-auto px-4'>
        <ul>
            {items.map((item, id) => (
              <li
                key={id}
                className='my-3 w-full flex justify-between bg-slate-950 text-white items-center'
              >
                <div className='p-3 w-full flex justify-between items-center'>
                  <span className='capitalize'>{item.name}</span>
                  <div className='flex items-center'>
                    <button
                      onClick={() =>
                        updateItemQuantity(item.id, item.quantity - 1)
                      }
                      className='text-white bg-red-600 w-20 rounded-lg hover:bg-red-700 p-2 text-xl'
                      >
                      -
                    </button>
                    <span className='mx-4'>{item.quantity}</span>
                    <button
                      onClick={() =>
                        updateItemQuantity(item.id, item.quantity + 1)
                      }
                      className='text-white bg-red-600 w-20 rounded-lg hover:bg-red-700 p-2 text-xl'
                    >
                      +
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
