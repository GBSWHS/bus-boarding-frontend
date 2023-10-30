import { 
  AppLayout,
  AppLayoutProps,
  SideNavigation,
  SideNavigationProps,
  TopNavigation
} from '@cloudscape-design/components'
import logo from '../../assets/logo.png'

const items: SideNavigationProps.Item[] = [
  { type: 'link', 'text': '버스 목록', 'href': '/admin/bus' },
  { type: 'link', 'text': '정류장 목록', 'href': '/admin/station' },
  { type: 'link', 'text': '학생 목록', 'href': '/admin/user' },
  { type: 'link', 'text': '탑승 기록', 'href': '/admin/history' },
]

export function CustomAppLayout(props: AppLayoutProps) {
  const path = window.location.pathname;

  return (
    <>
      <TopNavigation
        identity={{
          href: "/admin",
          title: "경소고 버스정보시스템",
          logo: { src: logo, alt: "경소고 로고" }
        }}
        utilities={[
          {
            type: "menu-dropdown",
            text: "관리자",
            description: "Administrator",
            iconName: "user-profile",
            items: [
              { id: "signout", text: "로그아웃", href: '/' }
            ]
          }
        ]}
      />
      <AppLayout
        toolsHide={true}
        navigation={
          <SideNavigation
            items={items}
            activeHref={path}
            header={{ href: "/admin", text: "버스, 학생 관리" }}
          />
        }
        {...props}
      />
    </>
  );
}
