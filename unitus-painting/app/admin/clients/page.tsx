'use client';
import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message, Space, Card, Typography, Upload, Modal, Affix } from 'antd';
import { PlusOutlined, DeleteOutlined, MenuOutlined, UploadOutlined, SaveOutlined, UndoOutlined } from '@ant-design/icons';
import { ClientsContent, defaultClientsContent } from '@/app/types/clients';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import type { UploadFile, RcFile } from 'antd/es/upload/interface';

const { Title } = Typography;

const ClientsCMS: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [uploadLoading, setUploadLoading] = useState<{ [key: string]: boolean }>({});
  const [isFormChanged, setIsFormChanged] = useState(false);
  const [initialValues, setInitialValues] = useState<ClientsContent | null>(null);

  // Track form changes
  const handleFormChange = (_changedValues: any, allValues: any) => {
    if (!initialValues) return;
    const hasChanges = JSON.stringify(allValues) !== JSON.stringify(initialValues);
    setIsFormChanged(hasChanges);
  };

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/clients');
        if (!response.ok) throw new Error('Failed to fetch content');
        const data = await response.json();
        form.setFieldsValue(data);
        setInitialValues(data);
      } catch (error) {
        console.error('Error fetching content:', error);
        message.error('Failed to load content. Loading default values.');
        form.setFieldsValue(defaultClientsContent);
        setInitialValues(defaultClientsContent);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [form]);

  const handleUpload = async (file: RcFile, fieldName: number): Promise<string> => {
    // Validate file size (2MB limit)
    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      message.error('Image must be smaller than 2MB!');
      throw new Error('File too large');
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      message.error('You can only upload JPG/PNG/WebP/GIF files!');
      throw new Error('Invalid file type');
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setUploadLoading(prev => ({ ...prev, [fieldName]: true }));
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      message.success('Logo uploaded successfully');
      return data.url;
    } catch (error) {
      console.error('Upload error:', error);
      message.error('Failed to upload logo');
      throw error;
    } finally {
      setUploadLoading(prev => ({ ...prev, [fieldName]: false }));
    }
  };

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
      
      message.success('Changes saved successfully');
      setInitialValues(values);
      setIsFormChanged(false);
    } catch (error) {
      console.error('Error updating content:', error);
      message.error('Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  const onReset = () => {
    Modal.confirm({
      title: 'Discard Changes',
      content: 'Are you sure you want to discard all changes? This cannot be undone.',
      okText: 'Yes, discard',
      okType: 'danger',
      cancelText: 'No, keep editing',
      onOk() {
        if (initialValues) {
          form.setFieldsValue(initialValues);
          setIsFormChanged(false);
          message.info('Changes discarded');
        }
      },
    });
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

    // Create completely new references to force change detection
    const newValues = {
      ...form.getFieldsValue(),
      clients: [...clients]
    };
    
    // Update form values and explicitly trigger change detection
    form.setFieldsValue(newValues);
    setIsFormChanged(true);
  };

  const handleRemoveClient = (fieldName: number) => {
    Modal.confirm({
      title: 'Remove Client',
      content: 'Are you sure you want to remove this client? This can be undone by discarding changes before saving.',
      okText: 'Yes, remove',
      okType: 'danger',
      cancelText: 'No, keep it',
      onOk() {
        const fields = form.getFieldValue('clients');
        fields.splice(fieldName, 1);
        form.setFieldValue('clients', [...fields]); // Create new reference
        setIsFormChanged(true);
        message.success('Client removed');
      },
    });
  };

  return (
    <>
      <Card className="max-w-4xl mx-auto my-8 mb-24">
        <Title level={2} className="mb-8">Notable Clients Management</Title>
        
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          onValuesChange={handleFormChange}
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
                  <div ref={provided.innerRef} {...provided.droppableProps}>
                    <Form.List name="clients">
                      {(fields, { add, remove }) => (
                        <>
                          {fields.map((field, index) => (
                            <Draggable
                              key={field.key.toString()}
                              draggableId={field.key.toString()}
                              index={index}
                            >
                              {(provided, snapshot) => (
                                <div 
                                  ref={provided.innerRef} 
                                  {...provided.draggableProps}
                                  className={snapshot.isDragging ? 'opacity-75' : ''}
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
                                        onClick={() => handleRemoveClient(field.name)}
                                      />
                                    }
                                  >
                                    <Form.Item
                                      label="Logo"
                                      required
                                      help="Maximum size: 2MB. Supported formats: JPG, PNG, WebP, GIF"
                                    >
                                      <Space direction="vertical" className="w-full">
                                        <Upload
                                          accept="image/jpeg,image/png,image/webp,image/gif"
                                          maxCount={1}
                                          showUploadList={false}
                                          customRequest={async ({ file }) => {
                                            try {
                                              const url = await handleUpload(file as RcFile, field.name);
                                              form.setFieldValue(['clients', field.name, 'src'], url);
                                            } catch (error) {
                                              // Error handled in handleUpload
                                            }
                                          }}
                                        >
                                          <Button 
                                            icon={<UploadOutlined />} 
                                            loading={uploadLoading[field.name]}
                                          >
                                            {form.getFieldValue(['clients', field.name, 'src']) 
                                              ? 'Change Logo' 
                                              : 'Upload Logo'
                                            }
                                          </Button>
                                        </Upload>
                                        <Form.Item
                                          {...field}
                                          name={[field.name, 'src']}
                                          noStyle
                                          rules={[{ required: true, message: 'Please upload a logo!' }]}
                                        >
                                          <Input hidden />
                                        </Form.Item>
                                      </Space>
                                    </Form.Item>

                                    <Form.Item
                                      {...field}
                                      label="Alt Text"
                                      name={[field.name, 'alt']}
                                      rules={[{ required: true, message: 'Please input alt text!' }]}
                                    >
                                      <Input placeholder="Enter alt text for the logo" />
                                    </Form.Item>

                                    {form.getFieldValue(['clients', field.name, 'src']) && (
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
                                    )}
                                  </Card>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                          <Form.Item>
                            <Button
                              type="dashed"
                              onClick={() => {
                                add();
                                setIsFormChanged(true);
                              }}
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

      {isFormChanged && (
        <Affix offsetBottom={0}>
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg p-4 flex justify-center space-x-4 z-50">
            <Button 
              type="primary" 
              icon={<SaveOutlined />}
              onClick={() => form.submit()}
              loading={saving}
            >
              Save Changes
            </Button>
            <Button 
              icon={<UndoOutlined />}
              onClick={onReset}
            >
              Discard Changes
            </Button>
          </div>
        </Affix>
      )}
    </>
  );
};

export default ClientsCMS;