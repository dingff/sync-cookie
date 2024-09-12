import { STORE_KEY } from '@/common/constants'
import store from '@/common/store'
import { uuid } from '@/common/utils'
import { useUpdateEffect } from 'ahooks'
import {
  Button,
  Input,
  Popconfirm,
  Switch,
  Table,
  type TableProps,
  Typography,
  message,
} from 'antd'
import { useEffect, useState } from 'react'
import styles from './index.module.scss'

type ListItem = {
  sourceUrl: string
  targetUrl: string
  id: string
  isEdit: boolean
  enabled: boolean
  auto: boolean
}
export default function Popup() {
  const [dataSource, setDataSource] = useState<ListItem[]>([])
  const [loading, setLoading] = useState(true)
  const columns: TableProps<ListItem>['columns'] = [
    {
      title: '源地址',
      dataIndex: 'sourceUrl',
      key: 'sourceUrl',
      width: 160,
      render: (_, record, index) => {
        const { sourceUrl, isEdit } = record
        return isEdit ? (
          <Input
            placeholder="请输入源地址"
            allowClear
            value={sourceUrl}
            onChange={(e) => {
              dataSource[index].sourceUrl = e.target.value
              setDataSource([...dataSource])
            }}
          />
        ) : (
          <Typography.Text ellipsis={{ tooltip: true }}>{sourceUrl}</Typography.Text>
        )
      },
    },
    {
      title: '目标地址',
      dataIndex: 'targetUrl',
      key: 'targetUrl',
      width: 160,
      render: (_, record, index) => {
        const { targetUrl, isEdit } = record
        return isEdit ? (
          <Input
            placeholder="请输入目标地址"
            allowClear
            value={targetUrl}
            onChange={(e) => {
              dataSource[index].targetUrl = e.target.value
              setDataSource([...dataSource])
            }}
          />
        ) : (
          <Typography.Text ellipsis={{ tooltip: true }}>{targetUrl}</Typography.Text>
        )
      },
    },
    {
      title: '是否启用',
      dataIndex: 'enabled',
      key: 'enabled',
      width: 60,
      render: (_, record, index) => {
        return (
          <Switch
            checked={record.enabled}
            onChange={(checked) => {
              dataSource[index].enabled = checked
              setDataSource([...dataSource])
            }}
          />
        )
      },
    },
    {
      title: '自动同步',
      dataIndex: 'auto',
      key: 'auto',
      width: 60,
      render: (_, record, index) => {
        return (
          <Switch
            checked={record.auto}
            onChange={(checked) => {
              dataSource[index].auto = checked
              setDataSource([...dataSource])
            }}
          />
        )
      },
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      render: (_, record, index) => {
        const { isEdit, id, sourceUrl, targetUrl } = record
        return isEdit ? (
          <Button
            type="link"
            onClick={() => {
              dataSource[index].isEdit = false
              setDataSource([...dataSource])
            }}
          >
            完成
          </Button>
        ) : (
          <>
            <Button
              type="link"
              onClick={() => {
                dataSource[index].isEdit = true
                setDataSource([...dataSource])
              }}
            >
              编辑
            </Button>
            <Popconfirm
              title="提示"
              description="确定要删除吗?"
              onConfirm={() => {
                setDataSource((prev) => {
                  return prev.filter((item) => item.id !== id)
                })
              }}
              okText="是"
              cancelText="否"
            >
              <Button danger type="link">
                删除
              </Button>
            </Popconfirm>
            <Button
              type="link"
              onClick={() => {
                chrome.runtime.sendMessage(
                  { action: 'SYNC_COOKIES', sourceUrl, targetUrl },
                  (response) => {
                    if (response?.status === 'success') {
                      message.success('已同步')
                    } else {
                      message.error(response.message)
                    }
                  },
                )
              }}
            >
              同步
            </Button>
          </>
        )
      },
    },
  ]
  const handleAdd = () => {
    setDataSource([
      ...dataSource,
      { sourceUrl: '', targetUrl: '', isEdit: true, id: uuid(8), enabled: true, auto: true },
    ])
  }
  useUpdateEffect(() => {
    store.set(STORE_KEY, dataSource)
  }, [dataSource])
  useEffect(() => {
    store.get(STORE_KEY).then((data) => {
      const next = (data || []).map((item) => {
        return { ...item, isEdit: false }
      })
      setDataSource(next)
      setLoading(false)
    })
  }, [])
  return (
    <div className={styles.content}>
      <div className={styles.oper}>
        <Button type="primary" onClick={handleAdd}>
          新增
        </Button>
      </div>
      <Table
        scroll={{ x: '100%' }}
        rowKey="id"
        loading={loading}
        columns={columns}
        dataSource={dataSource}
        pagination={false}
      />
    </div>
  )
}
