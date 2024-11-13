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
  Spin
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

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await fetch('/api/our-approach');
      const data = await response.json();
      form.setFieldsValue(data);
      setLoading(false);
    } catch (error) {
      message.error('Failed to fetch content');
      setLoading(false);
    }
  };

  const handleSubmit = async (values: any) => {
    setSaving(true);
    try {
      const response = await fetch('/api/content', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) throw new Error('Failed to update');
      message.success('Content updated successfully');
    } catch (error) {
      message.error('Failed to update content');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Spin size="large" className="flex justify-center items-center min-h-screen" />;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Card title="Content Management System" className="mb-8">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{}}
        >
          <Collapse defaultActiveKey={['1']}>
            {/* Hero Section */}
            <Panel header="Hero Section" key="1">
              <Form.Item
                label="Title"
                name={['hero', 'title']}
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Subtitle"
                name={['hero', 'subtitle']}
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            </Panel>

            {/* Key Features */}
            <Panel header="Key Features" key="2">
              <Form.List name="keyFeatures">
                {(fields, { add, remove }) => (
                  <div className="space-y-4">
                    {fields.map((field, index) => (
                      <Card key={field.key} className="bg-gray-50">
                        <Space direction="vertical" className="w-full">
                          <Form.Item
                            {...field}
                            label="Icon"
                            name={[field.name, 'icon']}
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
                          >
                            <Input />
                          </Form.Item>
                          <Button danger onClick={() => remove(field.name)}>
                            Remove Feature
                          </Button>
                        </Space>
                      </Card>
                    ))}
                    <Button type="dashed" onClick={() => add()} block>
                      Add Feature
                    </Button>
                  </div>
                )}
              </Form.List>
            </Panel>

            {/* Process Steps */}
            <Panel header="Process Steps" key="3">
              <Form.List name="processSteps">
                {(fields, { add, remove }) => (
                  <div className="space-y-4">
                    {fields.map((field, index) => (
                      <Card key={field.key} className="bg-gray-50">
                        <Space direction="vertical" className="w-full">
                          <Form.Item
                            {...field}
                            label="Icon"
                            name={[field.name, 'icon']}
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
                          >
                            <Input />
                          </Form.Item>
                          <Form.Item
                            {...field}
                            label="Description"
                            name={[field.name, 'description']}
                          >
                            <TextArea rows={4} />
                          </Form.Item>
                          <Button danger onClick={() => remove(field.name)}>
                            Remove Step
                          </Button>
                        </Space>
                      </Card>
                    ))}
                    <Button type="dashed" onClick={() => add()} block>
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
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Subtitle"
                name={['cta', 'subtitle']}
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
              <Card title="Primary Button" className="mb-4">
                <Form.Item
                  label="Text"
                  name={['cta', 'primaryButton', 'text']}
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="Link"
                  name={['cta', 'primaryButton', 'link']}
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>
              </Card>
              <Card title="Secondary Button">
                <Form.Item
                  label="Text"
                  name={['cta', 'secondaryButton', 'text']}
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="Link"
                  name={['cta', 'secondaryButton', 'link']}
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>
              </Card>
            </Panel>
          </Collapse>

          <Form.Item className="mt-8">
            <Button type="primary" htmlType="submit" loading={saving} size="large">
              Save Changes
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default ContentEditor;