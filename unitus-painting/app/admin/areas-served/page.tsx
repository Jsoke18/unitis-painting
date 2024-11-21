'use client'
import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Card, Space, Typography, message, Spin, InputNumber, Table } from 'antd';
import { MinusCircleOutlined, PlusOutlined, EditOutlined, SaveOutlined } from '@ant-design/icons';
import { AreasServedContent, Location } from '@/lib/db/areas-served';

const { Title } = Typography;
const { TextArea } = Input;

const AreasServedCMS: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentContent, setCurrentContent] = useState<AreasServedContent | null>(null);

  // Fetch initial data
  const fetchContent = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/areas-served');
      if (!response.ok) throw new Error('Failed to fetch content');
      const data = await response.json();
      setCurrentContent(data);
      form.setFieldsValue(data);
    } catch (error) {
      message.error('Failed to load content');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const handleSave = async (values: AreasServedContent) => {
    try {
      setSaving(true);
      const response = await fetch('/api/areas-served', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) throw new Error('Failed to update content');
      
      const updatedContent = await response.json();
      setCurrentContent(updatedContent);
      message.success('Content updated successfully');
      setIsEditing(false);
    } catch (error) {
      message.error('Failed to update content');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  // View mode for current content
  const ViewMode = () => {
    if (!currentContent) return null;

    const columns = [
      {
        title: 'Title',
        dataIndex: 'title',
        key: 'title',
      },
      {
        title: 'Description',
        dataIndex: 'description',
        key: 'description',
        ellipsis: true,
      },
      {
        title: 'Contact',
        dataIndex: 'contact',
        key: 'contact',
        render: (contact: Location['contact']) => (
          <Space direction="vertical">
            <div>📞 {contact.phone}</div>
            <div>📧 {contact.email}</div>
            <div>🕒 {contact.hours}</div>
          </Space>
        ),
      },
      {
        title: 'Address',
        dataIndex: 'address',
        key: 'address',
        render: (address: Location['address']) => 
          address ? (
            <Space direction="vertical">
              <div><strong>{address.title}</strong></div>
              {address.lines.map((line, i) => (
                <div key={i}>{line}</div>
              ))}
            </Space>
          ) : 'No address provided'
      },
    ];

    return (
      <div className="space-y-6">
        <Card title="Current Content">
          <Space direction="vertical" className="w-full">
            <div>
              <strong>Page Title:</strong> {currentContent.page.title}
            </div>
            <div>
              <strong>Subtitle:</strong> {currentContent.page.subtitle}
            </div>
            <div>
              <strong>Meta Description:</strong> {currentContent.page.metaDescription}
            </div>
          </Space>
        </Card>

        <Card title="Locations">
          <Table 
            dataSource={currentContent.locations} 
            columns={columns}
            rowKey="title"
            pagination={false}
          />
        </Card>

        <Button 
          type="primary" 
          icon={<EditOutlined />} 
          onClick={() => setIsEditing(true)}
          block
        >
          Edit Content
        </Button>
      </div>
    );
  };

  // Edit mode form
  const EditMode = () => (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSave}
      initialValues={currentContent}
      className="space-y-6"
    >
      <Card title="Page Content">
        <Form.Item
          name={['page', 'title']}
          label="Page Title"
          rules={[{ required: true, message: 'Please enter the page title' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name={['page', 'subtitle']}
          label="Page Subtitle"
          rules={[{ required: true, message: 'Please enter the page subtitle' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name={['page', 'metaDescription']}
          label="Meta Description"
          rules={[{ required: true, message: 'Please enter the meta description' }]}
        >
          <TextArea rows={4} />
        </Form.Item>
      </Card>

      <Form.List name="locations">
        {(fields, { add, remove }) => (
          <>
            {fields.map((field, index) => (
              <Card
                key={field.key}
                title={`Location ${index + 1}`}
                extra={
                  fields.length > 1 && (
                    <Button
                      type="text"
                      onClick={() => remove(field.name)}
                      icon={<MinusCircleOutlined />}
                      danger
                    >
                      Remove
                    </Button>
                  )
                }
              >
                <Form.Item
                  {...field}
                  name={[field.name, 'title']}
                  label="Location Title"
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  {...field}
                  name={[field.name, 'description']}
                  label="Description"
                  rules={[{ required: true }]}
                >
                  <TextArea rows={4} />
                </Form.Item>

                {/* Address Section */}
                <Card type="inner" title="Address">
                  <Form.Item
                    {...field}
                    name={[field.name, 'address', 'title']}
                    label="Address Title"
                  >
                    <Input />
                  </Form.Item>

                  <Form.List name={[field.name, 'address', 'lines']}>
                    {(addressLines, { add: addLine, remove: removeLine }) => (
                      <>
                        {addressLines.map((line, lineIndex) => (
                          <Space key={line.key} align="baseline">
                            <Form.Item
                              {...line}
                              validateTrigger={['onChange', 'onBlur']}
                              rules={[{ required: true, message: 'Please input address line or delete this field' }]}
                            >
                              <Input placeholder="Address line" />
                            </Form.Item>
                            {addressLines.length > 1 && (
                              <MinusCircleOutlined onClick={() => removeLine(line.name)} />
                            )}
                          </Space>
                        ))}
                        <Button type="dashed" onClick={() => addLine()} block icon={<PlusOutlined />}>
                          Add Address Line
                        </Button>
                      </>
                    )}
                  </Form.List>
                </Card>

                {/* Map Section */}
                <Card type="inner" title="Map Properties" className="mt-4">
                  <Space>
                    <Form.Item
                      {...field}
                      name={[field.name, 'mapProps', 'latitude']}
                      label="Latitude"
                      rules={[{ required: true }]}
                    >
                      <InputNumber step={0.000001} />
                    </Form.Item>

                    <Form.Item
                      {...field}
                      name={[field.name, 'mapProps', 'longitude']}
                      label="Longitude"
                      rules={[{ required: true }]}
                    >
                      <InputNumber step={0.000001} />
                    </Form.Item>

                    <Form.Item
                      {...field}
                      name={[field.name, 'mapProps', 'zoom']}
                      label="Zoom"
                      rules={[{ required: true }]}
                    >
                      <InputNumber min={1} max={20} />
                    </Form.Item>
                  </Space>
                </Card>

                {/* Contact Section */}
                <Card type="inner" title="Contact Information" className="mt-4">
                  <Form.Item
                    {...field}
                    name={[field.name, 'contact', 'phone']}
                    label="Phone"
                    rules={[{ required: true }]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    {...field}
                    name={[field.name, 'contact', 'email']}
                    label="Email"
                    rules={[{ required: true, type: 'email' }]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    {...field}
                    name={[field.name, 'contact', 'hours']}
                    label="Business Hours"
                    rules={[{ required: true }]}
                  >
                    <Input />
                  </Form.Item>
                </Card>
              </Card>
            ))}
            <Button 
              type="dashed" 
              onClick={() => add()} 
              block 
              icon={<PlusOutlined />}
              className="mt-4"
            >
              Add Location
            </Button>
          </>
        )}
      </Form.List>

      <Space className="w-full justify-end">
        <Button onClick={() => setIsEditing(false)}>
          Cancel
        </Button>
        <Button 
          type="primary" 
          htmlType="submit" 
          loading={saving}
          icon={<SaveOutlined />}
        >
          Save Changes
        </Button>
      </Space>
    </Form>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
      <Title level={2}>Areas Served Content Management</Title>
      <div className="mt-6">
        {isEditing ? <EditMode /> : <ViewMode />}
      </div>
    </div>
  );
};

export default AreasServedCMS;