'use client';
import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message, Space, Card, Typography, Upload, Modal } from 'antd';
import { PlusOutlined, DeleteOutlined, MenuOutlined } from '@ant-design/icons';
import { ClientsContent, defaultClientsContent, Client } from '@/app/types/clients';
import type { UploadFile } from 'antd/es/upload/interface';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const { Title } = Typography;

const ClientsCMS: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/clients');
        if (!response.ok) throw new Error('Failed to fetch content');
        const data = await response.json();
        form.setFieldsValue(data);
      } catch (error) {
        console.error('Error fetching content:', error);
        message.error('Failed to load content. Loading default values.');
        form.setFieldsValue(defaultClientsContent);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [form]);

  const onFinish = async (values: ClientsContent) => {
    try {
      setSaving(true);
      const response = await fetch('/api/clients', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) throw new Error('Failed to update content');
      
      message.success('Clients updated successfully');
    } catch (error) {
      console.error('Error updating content:', error);
      message.error('Failed to update content');
    } finally {
      setSaving(false);
    }
  };

  const onReset = () => {
    form.setFieldsValue(defaultClientsContent);
    message.info('Form reset to default values');
  };

  const handlePreview = (src: string, title: string) => {
    setPreviewImage(src);
    setPreviewTitle(title);
    setPreviewOpen(true);
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const clients = form.getFieldValue('clients');
    const [reorderedClient] = clients.splice(result.source.index, 1);
    clients.splice(result.destination.index, 0, reorderedClient);

    form.setFieldsValue({ clients });
  };

  return (
    <Card className="max-w-4xl mx-auto my-8">
      <Title level={2} className="mb-8">Notable Clients Management</Title>
      
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        disabled={loading}
        initialValues={defaultClientsContent}
      >
        <Card title="Main Content" className="mb-8">
          <Form.Item
            label="Heading"
            name="heading"
            rules={[{ required: true, message: 'Please input the heading!' }]}
          >
            <Input placeholder="Enter heading" />
          </Form.Item>
        </Card>

        <Card title="Clients" className="mb-8">
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="clients">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <Form.List name="clients">
                    {(fields, { add, remove }) => (
                      <>
                        {fields.map((field, index) => (
                          <Draggable
                            key={field.key.toString()}
                            draggableId={field.key.toString()}
                            index={index}
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                              >
                                <Card 
                                  className="mb-4"
                                  title={
                                    <div className="flex items-center">
                                      <span {...provided.dragHandleProps}>
                                        <MenuOutlined className="mr-2 cursor-grab" />
                                      </span>
                                      {`Client ${index + 1}`}
                                    </div>
                                  }
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
                                    label="Logo URL"
                                    name={[field.name, 'src']}
                                    rules={[{ required: true, message: 'Please input the logo URL!' }]}
                                  >
                                    <Input placeholder="Enter logo URL" />
                                  </Form.Item>

                                  <Form.Item
                                    {...field}
                                    label="Alt Text"
                                    name={[field.name, 'alt']}
                                    rules={[{ required: true, message: 'Please input alt text!' }]}
                                  >
                                    <Input placeholder="Enter alt text for the logo" />
                                  </Form.Item>

                                  <div className="mt-4">
                                    <img
                                      src={form.getFieldValue(['clients', field.name, 'src'])}
                                      alt="Preview"
                                      className="max-h-20 object-contain cursor-pointer"
                                      onClick={() => handlePreview(
                                        form.getFieldValue(['clients', field.name, 'src']),
                                        form.getFieldValue(['clients', field.name, 'alt'])
                                      )}
                                      onError={(e) => {
                                        const img = e.target as HTMLImageElement;
                                        img.src = '/placeholder-image.png';
                                      }}
                                    />
                                  </div>
                                </Card>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                        <Form.Item>
                          <Button
                            type="dashed"
                            onClick={() => add()}
                            icon={<PlusOutlined />}
                            block
                          >
                            Add Client
                          </Button>
                        </Form.Item>
                      </>
                    )}
                  </Form.List>
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </Card>

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" loading={saving}>
              Save Changes
            </Button>
            <Button htmlType="button" onClick={onReset}>
              Reset to Default
            </Button>
          </Space>
        </Form.Item>
      </Form>

      <Modal
        open={previewOpen}
        title={previewTitle}
        footer={null}
        onCancel={() => setPreviewOpen(false)}
      >
        <img 
          alt="Preview" 
          style={{ width: '100%' }} 
          src={previewImage}
          onError={(e) => {
            const img = e.target as HTMLImageElement;
            img.src = '/placeholder-image.png';
          }}
        />
      </Modal>
    </Card>
  );
};

export default ClientsCMS;