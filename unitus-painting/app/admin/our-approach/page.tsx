'use client';

import React, { useEffect, useState } from 'react';
import {
  Form,
  Input,
  Button,
  Card,
  Space,
  message,
  Collapse,
  Select,
  Spin,
  notification
} from 'antd';
import {
  ClipboardList,
  Paintbrush,
  Shield,
  CheckCircle,
  Droplets,
  Eye,
  Calendar,
  SprayCan,
  HeartHandshake,
  Ruler
} from 'lucide-react';
// app/admin/our-approach/page.tsx
import { OurApproachContent } from '@/app/types/our-approach';
const { Panel } = Collapse;
const { TextArea } = Input;

const iconMap: Record<string, React.ReactNode> = {
  ClipboardList: <ClipboardList />,
  Paintbrush: <Paintbrush />,
  Shield: <Shield />,
  CheckCircle: <CheckCircle />,
  Droplets: <Droplets />,
  Eye: <Eye />,
  Calendar: <Calendar />,
  SprayCan: <SprayCan />,
  HeartHandshake: <HeartHandshake />,
  Ruler: <Ruler />
};

const ContentEditor = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await fetch('/api/our-approach');
      if (!response.ok) throw new Error('Failed to fetch content');
      const data = await response.json();
      form.setFieldsValue(data);
      setLoading(false);
    } catch (error) {
      notification.error({
        message: 'Error',
        description: 'Failed to fetch content. Please try again.',
        duration: 0,
      });
      console.error('Fetch error:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (values: OurApproachContent) => {
    setSaving(true);
    const key = 'saving';
    
    try {
      notification.open({
        key,
        message: 'Saving changes...',
        description: 'Please wait while we update the content.',
        duration: 0,
      });

      const response = await fetch('/api/our-approach', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update content');
      }

      notification.success({
        key,
        message: 'Success',
        description: 'Content updated successfully!',
        duration: 4.5,
      });

    } catch (error) {
      notification.error({
        key,
        message: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update content',
        duration: 0,
      });
      console.error('Update error:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    notification.warning({
      message: 'Reset Changes?',
      description: 'Are you sure you want to reset all changes? This will reload the content from the server.',
      duration: 0,
      btn: (
        <Space>
          <Button type="default" size="small" onClick={() => notification.destroy()}>
            Cancel
          </Button>
          <Button 
            type="primary" 
            danger 
            size="small" 
            onClick={() => {
              fetchContent();
              notification.destroy();
            }}
          >
            Reset
          </Button>
        </Space>
      ),
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <>
      {contextHolder}
      <div className="p-6 max-w-4xl mx-auto">
        <Card 
          title="Our Approach Content Editor" 
          className="mb-8"
          extra={
            <Button onClick={handleReset} disabled={saving}>
              Reset Changes
            </Button>
          }
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{}}
            className="space-y-4"
          >
            <Collapse defaultActiveKey={['1']} className="bg-white">
              {/* Hero Section */}
              <Panel header="Hero Section" key="1">
                <Form.Item
                  label="Title"
                  name={['hero', 'title']}
                  rules={[{ required: true, message: 'Please enter a title' }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="Subtitle"
                  name={['hero', 'subtitle']}
                  rules={[{ required: true, message: 'Please enter a subtitle' }]}
                >
                  <TextArea rows={2} />
                </Form.Item>
              </Panel>

              {/* Key Features */}
              <Panel header="Key Features" key="2">
                <Form.List 
                  name="keyFeatures"
                  rules={[
                    {
                      validator: async (_, features) => {
                        if (!features || features.length < 1) {
                          return Promise.reject(new Error('At least one feature is required'));
                        }
                      },
                    },
                  ]}
                >
                  {(fields, { add, remove }) => (
                    <div className="space-y-4">
                      {fields.map((field, index) => (
                        <Card key={field.key} className="bg-gray-50">
                          <Space direction="vertical" className="w-full">
                            <Form.Item
                              {...field}
                              label="Icon"
                              name={[field.name, 'icon']}
                              rules={[{ required: true, message: 'Please select an icon' }]}
                            >
                              <Select>
                                {Object.keys(iconMap).map((icon) => (
                                  <Select.Option key={icon} value={icon}>
                                    <Space>
                                      {iconMap[icon]}
                                      {icon}
                                    </Space>
                                  </Select.Option>
                                ))}
                              </Select>
                            </Form.Item>
                            <Form.Item
                              {...field}
                              label="Label"
                              name={[field.name, 'label']}
                              rules={[{ required: true, message: 'Please enter a label' }]}
                            >
                              <Input />
                            </Form.Item>
                            <Button 
                              danger 
                              onClick={() => remove(field.name)}
                              disabled={fields.length === 1}
                            >
                              Remove Feature
                            </Button>
                          </Space>
                        </Card>
                      ))}
                      <Button 
                        type="dashed" 
                        onClick={() => add()} 
                        block
                        disabled={fields.length >= 4}
                      >
                        Add Feature
                      </Button>
                    </div>
                  )}
                </Form.List>
              </Panel>

              {/* Process Steps */}
              <Panel header="Process Steps" key="3">
                <Form.List 
                  name="processSteps"
                  rules={[
                    {
                      validator: async (_, steps) => {
                        if (!steps || steps.length < 1) {
                          return Promise.reject(new Error('At least one process step is required'));
                        }
                      },
                    },
                  ]}
                >
                  {(fields, { add, remove }) => (
                    <div className="space-y-4">
                      {fields.map((field, index) => (
                        <Card key={field.key} className="bg-gray-50">
                          <Space direction="vertical" className="w-full">
                            <Form.Item
                              {...field}
                              label="Icon"
                              name={[field.name, 'icon']}
                              rules={[{ required: true, message: 'Please select an icon' }]}
                            >
                              <Select>
                                {Object.keys(iconMap).map((icon) => (
                                  <Select.Option key={icon} value={icon}>
                                    <Space>
                                      {iconMap[icon]}
                                      {icon}
                                    </Space>
                                  </Select.Option>
                                ))}
                              </Select>
                            </Form.Item>
                            <Form.Item
                              {...field}
                              label="Title"
                              name={[field.name, 'title']}
                              rules={[{ required: true, message: 'Please enter a title' }]}
                            >
                              <Input />
                            </Form.Item>
                            <Form.Item
                              {...field}
                              label="Description"
                              name={[field.name, 'description']}
                              rules={[{ required: true, message: 'Please enter a description' }]}
                            >
                              <TextArea rows={4} />
                            </Form.Item>
                            <Button 
                              danger 
                              onClick={() => remove(field.name)}
                              disabled={fields.length === 1}
                            >
                              Remove Step
                            </Button>
                          </Space>
                        </Card>
                      ))}
                      <Button 
                        type="dashed" 
                        onClick={() => add()} 
                        block
                        disabled={fields.length >= 6}
                      >
                        Add Process Step
                      </Button>
                    </div>
                  )}
                </Form.List>
              </Panel>

              {/* CTA Section */}
              <Panel header="Call to Action" key="4">
                <Form.Item
                  label="Title"
                  name={['cta', 'title']}
                  rules={[{ required: true, message: 'Please enter a title' }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="Subtitle"
                  name={['cta', 'subtitle']}
                  rules={[{ required: true, message: 'Please enter a subtitle' }]}
                >
                  <TextArea rows={2} />
                </Form.Item>
                <Card title="Primary Button" className="mb-4">
                  <Form.Item
                    label="Text"
                    name={['cta', 'primaryButton', 'text']}
                    rules={[{ required: true, message: 'Please enter button text' }]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label="Link"
                    name={['cta', 'primaryButton', 'link']}
                    rules={[{ required: true, message: 'Please enter a link' }]}
                  >
                    <Input />
                  </Form.Item>
                </Card>
                <Card title="Secondary Button">
                  <Form.Item
                    label="Text"
                    name={['cta', 'secondaryButton', 'text']}
                    rules={[{ required: true, message: 'Please enter button text' }]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label="Link"
                    name={['cta', 'secondaryButton', 'link']}
                    rules={[{ required: true, message: 'Please enter a link' }]}
                  >
                    <Input />
                  </Form.Item>
                </Card>
              </Panel>
            </Collapse>

            <Form.Item className="mt-8">
              <Space>
                <Button type="primary" htmlType="submit" loading={saving} size="large">
                  Save Changes
                </Button>
                <Button onClick={handleReset} disabled={saving} size="large">
                  Reset Changes
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </>
  );
};

export default ContentEditor;