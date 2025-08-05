
import { FC } from 'react';
import { ColorRule, PolygonData } from '../../types';
import { useAppDispatch } from '../../hooks/redux-hooks';
import { updatePolygonRules, fetchPolygonData } from '../../store/slices/polygonsSlice';
import { Button, Form, InputNumber, Select, Space, Typography, ColorPicker } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import type { Color } from 'antd/es/color-picker';

const { Title, Text } = Typography;
const { Option } = Select;

interface RulesEngineProps {
  polygon: PolygonData;
}

export const RulesEngine: FC<RulesEngineProps> = ({ polygon }) => {
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();

  const onFinish = (values: { rules?: Partial<ColorRule & { color: Color | string }>[] }) => {
    const newRules = (values.rules || []).map(rule => {
      
      let colorString = '#808080'; // A default fallback color.

      if (rule.color) { 
        colorString = typeof rule.color === 'string' 
          ? rule.color 
          : (rule.color as Color).toHexString();
      }
      
      return {
        ...rule,
        id: rule.id || `rule_${new Date().getTime()}_${Math.random()}`,
        color: colorString,
      } as ColorRule;
    });

    dispatch(updatePolygonRules({ polygonId: polygon.id, rules: newRules }));
    dispatch(fetchPolygonData(polygon.id));
  };

  return (
    <div>
      <Title level={5} style={{ color: 'white' }}>Color Rules</Title>
      <Text type="secondary">Data Source: Temperature (°C)</Text>
      <Form
        form={form}
        name="rules_engine"
        onFinish={onFinish}
        initialValues={{ rules: polygon.rules }}
        autoComplete="off"
        style={{ marginTop: '1rem' }}
      >
        <Form.List name="rules">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                  <Form.Item {...restField} name={[name, 'operator']} rules={[{ required: true, message: 'Op' }]}>
                    <Select placeholder="Op" style={{ width: 65 }}>
                      <Option value=">">&gt;</Option>
                      <Option value="<">&lt;</Option>
                      <Option value="=">=</Option>
                      <Option value=">=">&ge;</Option>
                      <Option value="<=">&le;</Option>
                    </Select>
                  </Form.Item>
                  <Form.Item {...restField} name={[name, 'value']} rules={[{ required: true, message: 'Val' }]}>
                    <InputNumber placeholder="Value" style={{ width: 80 }} />
                  </Form.Item>
                  <Form.Item {...restField} name={[name, 'color']} rules={[{ required: true, message: 'Color' }]}>
                     <ColorPicker format="hex" />
                  </Form.Item>
                  <MinusCircleOutlined style={{color: '#ff4d4f'}} onClick={() => remove(name)} />
                </Space>
              ))}
              <Form.Item>
                <Button type="dashed" onClick={() => add({operator: '>', value: 20, color: '#ffc53d'})} block icon={<PlusOutlined />}>
                  Add Rule
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Apply Rules
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};