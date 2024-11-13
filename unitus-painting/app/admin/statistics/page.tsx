'use client';

import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message, Card, Typography, Select, Space } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { StatisticsContent, StatisticItem } from '@/types/Statistics';

const { Title } = Typography;

const iconOptions = [
  { value: 'CheckCircle', label: 'Check Circle' },
  { value: 'Star', label: 'Star' },
  { value: 'Award', label: 'Award' }
];

const colorOptions = [
  { value: 'text-green-500', label: 'Green' },
  { value: 'text-yellow-400', label: 'Yellow' },
  { value: 'text-blue-500', label: 'Blue' },
  { value: 'text-red-500', label: 'Red' },
  { value: 'text-purple-500', label: 'Purple' }
];

const StatisticsCMS: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/statistics');
        if (!response.ok) throw new Error('Failed to fetch content');
        const data = await response.json();
        form.setFieldsValue(data);
      } catch (error) {
        console.error('Error fetching content:', error);
        message.error('Failed to load content');
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [form]);

  const onFinish = async (values: StatisticsContent) => {
    try {
      setSaving(true);
      const response = await fetch('/api/statistics', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) throw new Error('Failed to update content');
      
      message.success('Statistics updated successfully');
    } catch (error) {
      console.error('Error updating content:', error);
      message.error('Failed to update content');
    } finally {
      setSaving(false);
    }
  };

  const onReset = async () => {
    try {
      const response = await fetch('/api/statistics');
      if (!response.ok) throw new Error('Failed to fetch content');
      const data = await response.json();
      form.setFieldsValue(data);
      message.success('Form reset to default values');
    } catch (error) {
      console.error('Error resetting form:', error);
      message.error('Failed to reset form');
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <Card>
        <div className="flex justify-between items-center mb-6">
          <Title level={2} className="mb-0">Statistics Section Management</Title>
          <Space>
            <Button htmlType="button" onClick={onReset}>
              Reset to Default
            </Button>
            <Button 
              type="primary" 
              onClick={() => form.submit()} 
              loading={saving}
            >
              Save Changes
            </Button>
          </Space>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          disabled={loading}
        >
          <Form.List name="statistics">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field, index) => (
                  <Card 
                    key={field.key} 
                    className="mb-6"
                    size="small"
                    title={`Statistic ${index + 1}`}
                    extra={
                      <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => remove(field.name)}
                      >
                        Remove
                      </Button>
                    }
                  >
                    <Form.Item
                      {...field}
                      label="Value"
                      name={[field.name, 'value']}
                      rules={[{ required: true, message: 'Please input the value!' }]}
                    >
                      <Input placeholder="e.g., 4,500+" />
                    </Form.Item>

                    <Form.Item
                      {...field}
                      label="Description"
                      name={[field.name, 'description']}
                      rules={[{ required: true, message: 'Please input the description!' }]}
                    >
                      <Input placeholder="e.g., Projects Completed" />
                    </Form.Item>

                    <Space className="w-full gap-4">
                      <Form.Item
                        {...field}
                        label="Icon"
                        name={[field.name, 'iconType']}
                        rules={[{ required: true, message: 'Please select an icon!' }]}
                        className="flex-1"
                      >
                        <Select
                          options={iconOptions}
                          placeholder="Select an icon"
                        />
                      </Form.Item>

                      <Form.Item
                        {...field}
                        label="Icon Color"
                        name={[field.name, 'iconColor']}
                        rules={[{ required: true, message: 'Please select a color!' }]}
                        className="flex-1"
                      >
                        <Select
                          options={colorOptions}
                          placeholder="Select a color"
                        />
                      </Form.Item>
                    </Space>
                  </Card>
                ))}

                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    Add Statistic
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Form>
      </Card>
    </div>
  );
};

export default StatisticsCMS;