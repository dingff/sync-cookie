import { STORE_KEY } from '@/common/constants'
import store from '@/common/store'
import { uuid } from '@/common/utils'
import { InfoCircleOutlined } from '@ant-design/icons'
import { useUpdateEffect } from 'ahooks'
import {
  Button,
  Input,
  Popconfirm,
  Space,
  Switch,
  Table,
  type TableProps,
  Tooltip,
  Typography,
} from 'antd'
import { useEffect, useState } from 'react'
import styles from './index.module.scss'

type ListItem = {
  sourceUrl: string
  targetUrl: string
  id: string
  isEdit: boolean
  enabled: boolean
}
export default function Popup() {
  const [dataSource, setDataSource] = useState<ListItem[]>([])
  const [loading, setLoading] = useState(true)
  const columns: TableProps<ListItem>['columns'] = [
    {
      title: (
        <Space align="center">
          源地址
          <Tooltip title="不区分端口">
            <InfoCircleOutlined />
          </Tooltip>
        </Space>
      ),
      dataIndex: 'sourceUrl',
      key: 'sourceUrl',
      width: 230,
      render: (_, record, index) => {
        const { sourceUrl, isEdit } = record
        return isEdit ? (
          <Input
            placeholder="http://"
            allowClear
            value={sourceUrl}
            onChange={(e) => {
              dataSource[index].sourceUrl = e.target.value?.trim()
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
      width: 150,
      render: (_, record, index) => {
        const { targetUrl, isEdit } = record
        return isEdit ? (
          <Input
            placeholder="http://"
            allowClear
            value={targetUrl}
            onChange={(e) => {
              dataSource[index].targetUrl = e.target.value?.trim()
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
      title: '操作',
      key: 'action',
      fixed: 'right',
      render: (_, record, index) => {
        const { isEdit, id } = record
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
          </>
        )
      },
    },
  ]
  const handleAdd = () => {
    setDataSource([
      ...dataSource,
      { sourceUrl: '', targetUrl: '', isEdit: true, id: uuid(8), enabled: true },
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
