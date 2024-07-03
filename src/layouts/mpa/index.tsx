import { ConfigProvider } from 'antd'
import './index.scss'

export default function Layout(props: any) {
  return (
    <ConfigProvider
      componentSize="small"
      theme={{
        token: {
          borderRadius: 2,
          colorText: '#222',
          fontSize: 12,
          controlInteractiveSize: 14,
          fontFamily: 'sans-serif',
          colorPrimary: '#597ef7',
        },
        components: {
          Table: {
            cellPaddingBlockSM: 4,
            cellPaddingInlineSM: 4,
          },
          Input: {
            paddingBlockSM: 3,
          },
        },
      }}
    >
      {props.children}
    </ConfigProvider>
  )
}
