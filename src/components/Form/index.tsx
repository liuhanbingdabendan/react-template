import React from 'react';
import { Form, Input, Select } from 'antd';
import type { InputProps, SelectProps } from 'antd'

type formItemType  = {} | InputProps

export interface itemType {
  title: string;
  name: string;
  type: 'input' | 'select';
  itemWidth?: number;
  itemConfig: InputProps | SelectProps
}

interface propsType {
  items: itemType[];
  initialValues?: any;
  layout?: 'horizontal' | 'vertical' | 'inline'
}

const ComObj = {
  input: Input,
  select: Select,
}

function CommonForm(props: propsType) {
  console.log(props, 'props');
  const { items, initialValues={}, layout = 'horizontal' } = props;
  return (
    <div>
      <Form
        name='common'
        autoComplete="off"
        initialValues={initialValues}
        layout={layout}
      >
        {
          items.map(v => {
            const Com: any = ComObj[v.type];
            return <Form.Item name={v.name} label={v.title} rules={[{ required: true }]}>
            <Com
              style={{ width: `${v.itemWidth ? v.itemWidth: 220}px` }}
              {...v.itemConfig}
            />
          </Form.Item>
          })
        }

      </Form>
    </div>
  );
}

export const useForm = Form.useForm;

export default CommonForm;
