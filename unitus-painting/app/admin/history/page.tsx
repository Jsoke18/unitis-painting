'use client';

import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message, Card, Typography, Tabs, Space } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { HistoryContent } from '@/app/types/history';

const { Title } = Typography;
const { TextArea } = Input;

const HistoryCMS: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/history');
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

  const onFinish = async (values: HistoryContent) => {
    try {
      setSaving(true);
      const response = await fetch('/api/history', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) throw new Error('Failed to update content');
      
      message.success('History content updated successfully');
    } catch (error) {
      console.error('Error updating content:', error);
      message.error('Failed to update content');
    } finally {
      setSaving(false);
    }
  };

  const onReset = async () => {
    try {
      const response = await fetch('/api/history');
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
          <Title level={2} className="mb-0">History Section Management</Title>
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
          <Tabs
            defaultActiveKey="1"
            type="card"
            items={[
              {
                key: "1",
                label: "Header Content",
                children: (
                  <div className="py-4">
                    <Form.Item
                      label="Badge Text"
                      name={['title', 'badge']}
                      rules={[{ required: true, message: 'Please input the badge text!' }]}
                    >
                      <Input placeholder="Enter badge text" />
                    </Form.Item>

                    <Form.Item
                      label="Main Heading"
                      name={['title', 'mainHeading']}
                      rules={[{ required: true, message: 'Please input the main heading!' }]}
                    >
                      <Input placeholder="Enter main heading" />
                    </Form.Item>

                    <Form.Item
                      label="Sub Heading"
                      name={['title', 'subHeading']}
                      rules={[{ required: true, message: 'Please input the sub heading!' }]}
                    >
                      <TextArea 
                        rows={3} 
                        placeholder="Enter sub heading"
                      />
                    </Form.Item>
                  </div>
                ),
              },
              {
                key: "2",
                label: "History Cards",
                children: (
                  <div className="py-4">
                    <Form.List name="historyCards">
                      {(fields, { add, remove }) => (
                        <>
                          {fields.map((field, index) => (
                            <Card 
                              key={field.key} 
                              className="mb-4"
                              size="small"
                              title={`Card ${index + 1}`}
                              extra={
                                <Button
                                  type="text"
                                  danger
                                  icon={<DeleteOutlined />}
                                  onClick={() => remove(field.name)}
                                />
                              }
                            >
                              <Form.Item
                                {...field}
                                label="Title"
                                name={[field.name, 'title']}
                                rules={[{ required: true, message: 'Please input the card title!' }]}
                              >
                                <Input placeholder="Enter card title" />
                              </Form.Item>

                              <Form.Item
                                {...field}
                                label="Description"
                                name={[field.name, 'description']}
                                rules={[{ required: true, message: 'Please input the card description!' }]}
                              >
                                <TextArea 
                                  rows={3}
                                  placeholder="Enter card description" 
                                />
                              </Form.Item>
                            </Card>
                          ))}
                          <Form.Item>
                            <Button
                              type="dashed"
                              onClick={() => add()}
                              block
                              icon={<PlusOutlined />}
                            >
                              Add History Card
                            </Button>
                          </Form.Item>
                        </>
                      )}
                    </Form.List>
                  </div>
                ),
              },
              {
                key: "3",
                label: "Timeline",
                children: (
                  <div className="py-4">
                    <Form.List name="timelineItems">
                      {(fields, { add, remove }) => (
                        <>
                          {fields.map((field, index) => (
                            <Card 
                              key={field.key} 
                              className="mb-4"
                              size="small"
                              title={`Timeline Item ${index + 1}`}
                              extra={
                                <Button
                                  type="text"
                                  danger
                                  icon={<DeleteOutlined />}
                                  onClick={() => remove(field.name)}
                                />
                              }
                            >
                              <Form.Item
                                {...field}
                                label="Year"
                                name={[field.name, 'year']}
                                rules={[{ required: true, message: 'Please input the year!' }]}
                              >
                                <Input placeholder="Enter year" />
                              </Form.Item>

                              <Form.Item
                                {...field}
                                label="Description"
                                name={[field.name, 'description']}
                                rules={[{ required: true, message: 'Please input the description!' }]}
                              >
                                <TextArea 
                                  rows={3}
                                  placeholder="Enter timeline item description" 
                                />
                              </Form.Item>
                            </Card>
                          ))}
                          <Form.Item>
                            <Button
                              type="dashed"
                              onClick={() => add()}
                              block
                              icon={<PlusOutlined />}
                            >
                              Add Timeline Item
                            </Button>
                          </Form.Item>
                        </>
                      )}
                    </Form.List>
                  </div>
                ),
              }
            ]}
          />
        </Form>
      </Card>
    </div>
  );
};

export default HistoryCMS;