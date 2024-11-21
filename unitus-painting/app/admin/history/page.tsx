'use client';

import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message, Card, Typography, Tabs, Space, Spin } from 'antd';
import { PlusOutlined, DeleteOutlined, ReloadOutlined, SaveOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { TextArea } = Input;

const HistoryCMS = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Fetch content
  const fetchContent = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/history');
      if (!response.ok) throw new Error('Failed to fetch content');
      const data = await response.json();
      form.setFieldsValue(data);
    } catch (error) {
      console.error('Error:', error);
      message.error('Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  // Save content
  const onFinish = async (values) => {
    try {
      setSaving(true);
      const response = await fetch('/api/history', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!response.ok) throw new Error('Failed to update');
      message.success('Updated successfully');
      await fetchContent(); // Refresh content
    } catch (error) {
      console.error('Error:', error);
      message.error('Failed to update');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <Card>
        <div className="flex justify-between items-center mb-6">
          <Title level={2} className="mb-0">History Section Management</Title>
          <Space>
            <Button 
              icon={<ReloadOutlined />}
              onClick={fetchContent}
              disabled={saving}
            >
              Reset
            </Button>
            <Button 
              type="primary"
              icon={<SaveOutlined />}
              onClick={() => form.submit()}
              loading={saving}
            >
              Save
            </Button>
          </Space>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          disabled={saving}
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
                      rules={[{ required: true, message: 'Required' }]}
                    >
                      <Input />
                    </Form.Item>

                    <Form.Item
                      label="Main Heading"
                      name={['title', 'mainHeading']}
                      rules={[{ required: true, message: 'Required' }]}
                    >
                      <Input />
                    </Form.Item>

                    <Form.Item
                      label="Sub Heading"
                      name={['title', 'subHeading']}
                      rules={[{ required: true, message: 'Required' }]}
                    >
                      <TextArea rows={3} />
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
                                rules={[{ required: true, message: 'Required' }]}
                              >
                                <Input />
                              </Form.Item>

                              <Form.Item
                                {...field}
                                label="Description"
                                name={[field.name, 'description']}
                                rules={[{ required: true, message: 'Required' }]}
                              >
                                <TextArea rows={3} />
                              </Form.Item>
                            </Card>
                          ))}
                          <Button
                            type="dashed"
                            onClick={() => add()}
                            block
                            icon={<PlusOutlined />}
                          >
                            Add History Card
                          </Button>
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
                                rules={[{ required: true, message: 'Required' }]}
                              >
                                <Input />
                              </Form.Item>

                              <Form.Item
                                {...field}
                                label="Description"
                                name={[field.name, 'description']}
                                rules={[{ required: true, message: 'Required' }]}
                              >
                                <TextArea rows={3} />
                              </Form.Item>
                            </Card>
                          ))}
                          <Button
                            type="dashed"
                            onClick={() => add()}
                            block
                            icon={<PlusOutlined />}
                          >
                            Add Timeline Item
                          </Button>
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