"use client";

import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message, Table, Modal, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import axios from 'axios';

interface Video {
  id: number;
  name: string;
  videoDate: string;
  url: string;
  createdAt: string;
  updatedAt?: string;
}

interface FormValues {
  name: string;
  videoDate: string;
  url: string;
}

const getEmbedUrl = (url: string): string => {
  try {
    const urlObj = new URL(url);
    
    // Handle YouTube URLs
    if (urlObj.hostname.includes('youtube.com') || urlObj.hostname.includes('youtu.be')) {
      let videoId = '';
      if (urlObj.hostname.includes('youtu.be')) {
        videoId = urlObj.pathname.slice(1);
      } else if (urlObj.searchParams.has('v')) {
        videoId = urlObj.searchParams.get('v') || '';
      } else {
        videoId = urlObj.pathname.split('/').pop() || '';
      }
      return `https://www.youtube.com/embed/${videoId}?autoplay=0&origin=${window.location.origin}`;
    }
    
    // Handle Vimeo URLs
    if (urlObj.hostname.includes('vimeo.com')) {
      const videoId = urlObj.pathname.split('/').pop();
      return `https://player.vimeo.com/video/${videoId}?autoplay=0&origin=${window.location.origin}`;
    }
    
    // Return original URL if no special handling needed
    return url;
  } catch (e) {
    return url;
  }
};

const VideoAdmin: React.FC = () => {
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [tableLoading, setTableLoading] = useState(false);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    setTableLoading(true);
    try {
      const response = await fetch('/api/videos');
      if (!response.ok) {
        throw new Error('Failed to fetch videos');
      }
      const data = await response.json();
      const videosArray = data.videos || [];
      setVideos(Array.isArray(videosArray) ? videosArray : []);
    } catch (error) {
      console.error('Failed to load videos:', error);
      message.error('Failed to load videos');
      setVideos([]);
    } finally {
      setTableLoading(false);
    }
  };

  const createVideo = async (values: FormValues) => {
    setLoading(true);
    try {
      const response = await axios.post('/api/videos', values);
      if (response.data.success) {
        message.success('Video added successfully');
        setAddModalVisible(false);
        form.resetFields();
        await fetchVideos();
      }
    } catch (error) {
      console.error('Failed to add video:', error);
      message.error('Failed to add video');
    } finally {
      setLoading(false);
    }
  };

  const updateVideo = async (values: FormValues) => {
    if (!editingVideo) return;
    setLoading(true);
    try {
      await axios.put('/api/videos', {
        id: editingVideo.id,
        name: values.name,
        videoDate: values.videoDate,
        url: values.url
      });
      
      message.success('Video updated successfully');
      setEditModalVisible(false);
      await fetchVideos();
    } catch (error) {
      console.error('Failed to update video:', error);
      message.error('Failed to update video');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/api/videos?id=${id}`);
      message.success('Video deleted successfully');
      await fetchVideos();
    } catch (error) {
      console.error('Failed to delete video:', error);
      message.error('Failed to delete video');
    }
  };

  const VideoPreview = ({ url }: { url: string }) => {
    const embedUrl = getEmbedUrl(url);
    
    // Check if it's a direct video URL (like from S3)
    const isDirectVideo = url.match(/\.(mp4|webm|ogg)$/i);
    
    if (isDirectVideo) {
      return (
        <div className="relative pt-[56.25%] w-full">
          <video
            className="absolute top-0 left-0 w-full h-full rounded-lg"
            src={url}
            controls
            preload="none"
            playsInline
          />
        </div>
      );
    }
    
    return (
      <div className="relative pt-[56.25%] w-full">
        <iframe
          className="absolute top-0 left-0 w-full h-full rounded-lg"
          src={embedUrl}
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          sandbox="allow-same-origin allow-scripts allow-popups allow-presentation"
        />
      </div>
    );
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: '20%',
      ellipsis: true,
    },
    {
      title: 'Date',
      dataIndex: 'videoDate',
      key: 'videoDate',
      width: '10%',
    },
    {
      title: 'Preview',
      key: 'preview',
      width: '25%',
      render: (_: any, record: Video) => (
        <VideoPreview url={record.url} />
      ),
    },
    {
      title: 'URL',
      dataIndex: 'url',
      key: 'url',
      width: '25%',
      ellipsis: true,
      render: (url: string) => (
        <a 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer"
          title={url}
        >
          {url}
        </a>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      width: 150,
      render: (_: any, record: Video) => (
        <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete video"
            description="Are you sure you want to delete this video?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="text" danger icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  const handleEdit = (record: Video) => {
    setEditingVideo(record);
    editForm.setFieldsValue({
      name: record.name,
      videoDate: record.videoDate,
      url: record.url,
    });
    setEditModalVisible(true);
  };

  const VideoForm = ({ form, onFinish, submitText }: { form: any, onFinish: (values: FormValues) => void, submitText: string }) => {
    const [previewUrl, setPreviewUrl] = useState<string>('');

    useEffect(() => {
      const url = form.getFieldValue('url');
      if (url) {
        setPreviewUrl(url);
      }
    }, [form]);

    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setPreviewUrl(e.target.value);
    };

    return (
      <Form 
        form={form} 
        layout="vertical" 
        onFinish={onFinish}
        className="w-full"
      >
        <div className="space-y-4">
          <Form.Item
            name="name"
            label="Video Name"
            rules={[{ required: true, message: 'Please enter video name' }]}
          >
            <Input placeholder="Enter video name" className="w-full" />
          </Form.Item>
          <Form.Item
            name="videoDate"
            label="Video Date"
            rules={[{ required: true, message: 'Please select video date' }]}
          >
            <Input type="date" className="w-full" />
          </Form.Item>
          <Form.Item
            name="url"
            label="Video URL"
            rules={[{ required: true, message: 'Please enter video URL' }]}
            extra="Enter a YouTube, Vimeo, or direct video URL"
          >
            <Input 
              placeholder="Enter video URL (e.g., https://youtube.com/watch?v=xxxxx)" 
              onChange={handleUrlChange}
              className="w-full"
            />
          </Form.Item>
          
          {previewUrl && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Video Preview
              </label>
              <div className="w-full">
                <VideoPreview url={previewUrl} />
              </div>
            </div>
          )}

          <Form.Item className="mb-0">
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              className="w-full md:w-auto"
            >
              {submitText}
            </Button>
          </Form.Item>
        </div>
      </Form>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Video Management</h1>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setAddModalVisible(true)}
            size="large"
          >
            Add Video
          </Button>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <Table
            columns={columns}
            dataSource={videos}
            rowKey="id"
            pagination={{ pageSize: 10 }}
            loading={tableLoading}
            scroll={{ x: 1200 }}
          />
        </div>
        <Modal
          title="Add New Video"
          open={addModalVisible}
          onCancel={() => {
            setAddModalVisible(false);
            form.resetFields();
          }}
          footer={null}
          width={800}
          style={{ top: 20 }}
          bodyStyle={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}
        >
          <VideoForm form={form} onFinish={createVideo} submitText="Add Video" />
        </Modal>
        <Modal
          title="Edit Video"
          open={editModalVisible}
          onCancel={() => {
            setEditModalVisible(false);
            setEditingVideo(null);
            editForm.resetFields();
          }}
          footer={null}
          width={800}
          style={{ top: 20 }}
          bodyStyle={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}
        >
          <VideoForm form={editForm} onFinish={updateVideo} submitText="Update Video" />
        </Modal>
      </div>
    </div>
  );
};

export default VideoAdmin; 