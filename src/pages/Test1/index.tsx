import React from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { decrement, increment } from '../../store/counterSlice';
import Form from '../../components/Form';
import type { itemType } from '../../components/Form';
import { Button } from 'antd';

function Test1() {
  const count = useAppSelector(state => state.counter.value)
  const dispatch = useAppDispatch();
  console.log(count, dispatch, 'store')
  // dispatch(decrement())
  const add = () => {
    dispatch(increment());
  };
  const cut = () => {
    dispatch(decrement());
  };
  const items: itemType[] = [
    {
      title: 'input',
      name: 'input',
      type: 'input',
      itemConfig: {
        placeholder: '测试'
      }
    },
    {
      title: 'select',
      name: 'select',
      type: 'select',
      itemWidth: 220,
      itemConfig: {
        placeholder: '选择',
        options: [
          {
            label: '1111',
            value: 0
          }
        ]
      }
    }
  ];
  return (
    <div>
      Test1
      {count}
      <Button type='primary' onClick={add}>+</Button>
      ------
      <button onClick={cut}>-</button>
      <div>
        <Form items={items} layout='inline' />
      </div>
    </div>
  );
}

export default Test1;
