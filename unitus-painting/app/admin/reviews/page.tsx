"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
  Table,
  Card,
  Button,
  Modal,
  Form,
  Input,
  Rate,
  Space,
  Popconfirm,
  message,
  DatePicker,
  Spin,
} from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { MessageSquare } from "lucide-react";
import { useReviewStore } from "@/lib/reviewService";
import type { Review } from "@/lib/reviewService";

export default function ReviewsPage() {
  // Store hooks
  const { 
    reviews, 
    stats,
    addReview, 
    updateReview, 
    deleteReview,
    fetchReviews,
    isLoading
  } = useReviewStore();

  // Local state
  const [modalVisible, setModalVisible] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form] = Form.useForm();

  // Initial data fetch
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        await fetchReviews();
      } catch (error) {
        message.error('Failed to load reviews');
        console.error('Error loading reviews:', error);
      }
    };
    loadInitialData();
  }, [fetchReviews]);

  // Refresh data function
  const refreshData = useCallback(async () => {
    try {
      await fetchReviews();
    } catch (error) {
      message.error('Failed to refresh reviews');
      console.error('Error refreshing reviews:', error);
    }
  }, [fetchReviews]);

  // Handle opening modal for add/edit
  const handleAddEdit = useCallback((record: Review | null = null) => {
    setEditingReview(record);
    if (record) {
      form.setFieldsValue({
        ...record,
        date: dayjs(record.date),
      });
    } else {
      form.resetFields();
      form.setFieldsValue({
        rating: 5,
        date: dayjs(),
      });
    }
    setModalVisible(true);
  }, [form]);

  // Handle delete review
  const handleDelete = useCallback(async (id: number) => {
    try {
      await deleteReview(id);
      message.success('Review deleted successfully');
      await refreshData();
    } catch (error) {
      message.error('Failed to delete review');
      console.error('Error deleting review:', error);
    }
  }, [deleteReview, refreshData]);

  // Handle modal submission
  const handleModalSubmit = async () => {
    try {
      setIsSubmitting(true);
      const values = await form.validateFields();
      
      const formattedValues = {
        ...values,
        date: values.date.format('YYYY-MM-DD'),
      };

      if (editingReview) {
        await updateReview({ ...formattedValues, id: editingReview.id });
        message.success('Review updated successfully');
      } else {
        await addReview(formattedValues);
        message.success('Review added successfully');
      }

      setModalVisible(false);
      form.resetFields();
      await refreshData();
    } catch (error) {
      if (error instanceof Error) {
        message.error(error.message || 'Failed to save review');
      } else {
        message.error('An unexpected error occurred');
      }
      console.error('Form submission failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle modal cancel
  const handleModalCancel = useCallback(() => {
    setModalVisible(false);
    setEditingReview(null);
    form.resetFields();
  }, [form]);

  // Table columns configuration
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: Review, b: Review) => a.name.localeCompare(b.name),
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      render: (rating: number) => <Rate disabled defaultValue={rating} />,
      sorter: (a: Review, b: Review) => a.rating - b.rating,
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date: string) => dayjs(date).format('MMMM D, YYYY'),
      sorter: (a: Review, b: Review) => dayjs(a.date).unix() - dayjs(b.date).unix(),
    },
    {
      title: 'Content',
      dataIndex: 'content',
      key: 'content',
      ellipsis: true,
      width: '30%',
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_: unknown, record: Review) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleAddEdit(record)}
          />
          <Popconfirm
            title="Delete Review"
            description="Are you sure you want to delete this review?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Stats cards data
  const statsCards = stats ? [
    {
      title: 'Total Reviews',
      value: reviews.length
    },
    {
      title: 'Average Rating',
      value: stats.averageRating.toFixed(1)
    },
    {
      title: 'Customer Satisfaction',
      value: `${stats.customerSatisfaction}%`
    },
    {
      title: 'Featured Reviews',
      value: stats.featuredAvatars.length
    }
  ] : [];

  return (
    <div className="p-6">
      <Card 
        title={
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            <span>Reviews Management</span>
          </div>
        }
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => handleAddEdit()}
          >
            Add Review
          </Button>
        }
      >
        {/* Stats Grid */}
        {stats && (
          <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {statsCards.map((stat, index) => (
              <Card size="small" key={index}>
                <div className="text-sm text-gray-600">{stat.title}</div>
                <div className="text-xl font-semibold">{stat.value}</div>
              </Card>
            ))}
          </div>
        )}

        {/* Reviews Table */}
        <Table
          columns={columns}
          dataSource={reviews}
          rowKey="id"
          loading={isLoading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} reviews`,
          }}
        />
      </Card>

      {/* Add/Edit Modal */}
      {modalVisible && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
            onClick={handleModalCancel}
          />
          <div className="relative w-full max-w-[1000px] mx-4 bg-white rounded-lg shadow-xl">
            <Modal
              title={editingReview ? 'Edit Review' : 'Add Review'}
              open={modalVisible}
              onOk={handleModalSubmit}
              onCancel={handleModalCancel}
              width={1000}
              centered
              className="!m-0"
              confirmLoading={isSubmitting}
              style={{
                position: 'relative',
                top: 0,
                padding: 0,
                maxHeight: '90vh',
                margin: 0
              }}
              wrapClassName="!p-0"
              modalRender={(modal) => (
                <div className="flex items-center justify-center w-full">
                  {modal}
                </div>
              )}
              bodyStyle={{
                padding: '32px',
                maxHeight: 'calc(90vh - 110px)',
                overflowY: 'auto'
              }}
            >
              <Form
                form={form}
                layout="vertical"
                initialValues={{ rating: 5 }}
                className="px-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <Form.Item
                      name="name"
                      label={<div className="flex items-center gap-1">Name <span className="text-red-500">*</span></div>}
                      rules={[{ required: true, message: 'Please enter the name' }]}
                    >
                      <Input size="large" />
                    </Form.Item>

                    <Form.Item
                      name="location"
                      label={<div className="flex items-center gap-1">Location <span className="text-red-500">*</span></div>}
                      rules={[{ required: true, message: 'Please enter the location' }]}
                    >
                      <Input size="large" />
                    </Form.Item>

                    <Form.Item
                      name="avatarSrc"
                      label={<div className="flex items-center gap-1">Avatar Source <span className="text-red-500">*</span></div>}
                      rules={[{ required: true, message: 'Please enter the avatar source' }]}
                    >
                      <Input size="large" placeholder="/avatar1.jpg" />
                    </Form.Item>
                  </div>

                  <div>
                    <Form.Item
                      name="rating"
                      label={<div className="flex items-center gap-1">Rating <span className="text-red-500">*</span></div>}
                      rules={[{ required: true, message: 'Please select the rating' }]}
                    >
                      <Rate />
                    </Form.Item>

                    <Form.Item
                      name="date"
                      label={<div className="flex items-center gap-1">Date <span className="text-red-500">*</span></div>}
                      rules={[{ required: true, message: 'Please select the date' }]}
                    >
                      <DatePicker size="large" style={{ width: '100%' }} />
                    </Form.Item>
                  </div>
                </div>

                <Form.Item
                  name="content"
                  label={<div className="flex items-center gap-1">Content <span className="text-red-500">*</span></div>}
                  rules={[{ required: true, message: 'Please enter the review content' }]}
                >
                  <Input.TextArea rows={6} />
                </Form.Item>
              </Form>
            </Modal>
          </div>
        </div>
      )}
    </div>
  );
}