import React from 'react';
import { Table, Space, Button, Input } from 'antd';

function getColumns({ editId, editText, setEditText, onDelete, onStartEdit, onSaveEdit, onCancelEdit }) {
    return [
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            render: (text, record) => 
                editId === record.id ? (
                    <Input 
                        value={editText} 
                        onChange={(e) => setEditText(e.target.value)}
                        onPressEnter={() => onSaveEdit(record.id)}
                    />
                ) : text,
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    {editId === record.id ? (
                        <>
                            <Button type="primary" onClick={() => onSaveEdit(record.id)}>Save</Button>
                            <Button onClick={onCancelEdit}>Cancel</Button>
                        </>
                    ) : (
                        <>
                            <Button onClick={() => onStartEdit(record)}>Edit</Button>
                            <Button danger onClick={() => onDelete(record)}>Delete</Button>
                        </>
                    )}
                </Space>
            ),
        },
    ];
}

function TodoTable({ data, loading, ...props }) {
    return (
        <Table
            rowKey="id"
            size="large"
            loading={loading}
            columns={getColumns(props)}
            dataSource={data}
            pagination={false}
        />
    );
}

export default TodoTable;