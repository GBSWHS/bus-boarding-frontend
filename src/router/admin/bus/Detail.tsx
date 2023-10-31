import "@cloudscape-design/global-styles/index.css"
import { CustomAppLayout } from "../../../components/admin/CustomLayout"
import { BreadcrumbGroup, ContentLayout, SpaceBetween, Button, Header, ColumnLayout, Box, Container, TableProps } from "@cloudscape-design/components"
import { Link, useParams } from "react-router-dom"
import CustomTable from "../../../components/admin/CustomTable"
import { PropertyFilterProperty } from "@cloudscape-design/collection-hooks"
import UserType from "../../../interfaces/UserType"
import UserListType from "../../../interfaces/UserListType"

const COLUMN_DEFINATIONS: TableProps.ColumnDefinition<UserListType>[] = [
  {
    id: 'studentId',
    header: '학번',
    cell: item => <Link to={`/admin/user/${item.id}`}>{item.studentId}</Link>,
    isRowHeader: true,
    sortingField: 'studentId'
  },
  {
    id: 'name',
    header: '이름',
    cell: item => <Link to={`/admin/user/${item.id}`}>{item.name}</Link>,
    sortingField: 'name'
  },
  {
    id: 'phone_number',
    header: '전화번호',
    cell: item => item.phone_number,
    sortingField: 'phone_number'
  },
  {
    id: 'bus',
    header: '탑승 버스',
    cell: item => <Link to={`/admin/bus/${item.busId}`}>{item.bus}</Link>,
    sortingField: 'bus'
  },
  {
    id: 'station',
    header: '하차 지점',
    cell: item => <Link to={`/admin/station/${item.stationId}`}>{item.station}</Link>,
    sortingField: 'station'
  },
  {
    id: 'admin',
    header: '관리자 여부',
    cell: item => item.admin ? '관리자' : '일반 탑승자',
    sortingField: 'admin'
  }
]

const FILTERING_PROPERTIES: PropertyFilterProperty[] = [
  {
    propertyLabel: '학번',
    key: 'studentId',
    groupValuesLabel: '학번',
    operators: ['=', ':']
  },
  {
    propertyLabel: '이름',
    key: 'name',
    groupValuesLabel: '이름',
    operators: ['=', ':']
  },
  {
    propertyLabel: '전화번호',
    key: 'phone_number',
    groupValuesLabel: '전화번호',
    operators: ['=', ':']
  },
  {
    propertyLabel: '탑승 버스',
    key: 'bus',
    groupValuesLabel: '탑승 버스',
    operators: ['=', ':']
  },
  {
    propertyLabel: '하차 지점',
    key: 'station',
    groupValuesLabel: '하차 지점',
    operators: ['=', ':']
  },
  {
    propertyLabel: '관리자 여부',
    key: 'admin',
    groupValuesLabel: '관리자 여부',
    operators: ['=']
  }
]

const tempData: UserType[] = [
  {
    id: 1,
    studentId: '3111',
    name: "김철수",
    phone_number: '01037290245',
    admin: true,
    boarding: {
      id: 1,
      name: '1번 버스',
      description: '1번 버스입니다.'
    },
    destination: {
      id: 2,
      name: '석적읍',
      location: '경상북도 칠곡군 석적읍 석적로 955-19 105동 901호',
    }
  },
  {
    id: 2,
    studentId: '3112',
    name: "김철수",
    phone_number: '01037290245',
    admin: false,
    boarding: {
      id: 1,
      name: '1번 버스',
      description: '1번 버스입니다.'
    },
    destination: {
      id: 2,
      name: '석적읍',
      location: '경상북도 칠곡군 석적읍 석적로 955-19 105동 901호',
    }
  }
]

const data: UserListType[] = tempData.map(item => { 
  return {
    id: item.id,
    studentId: item.studentId,
    name: item.name,
    phone_number: item.phone_number,
    admin: item.admin,
    bus: item.boarding?.name ?? '',
    busId: item.boarding?.id ?? 0,
    station: item.destination?.name ?? '',
    stationId: item.destination?.id ?? 0
  }
})

function BusDetail() {
  const studentName = 'test'
  const { busId } = useParams()

  return (
    <>
      <CustomAppLayout
        contentType="table"
        breadcrumbs={<BreadcrumbGroup items={[{ text: "홈", href: "/admin" }, { text: "버스 목록", href: '/admin/bus'}, { text: '버스 추가', href: '/admin/bus/create' }]} />}
        content={
          <ContentLayout
            header={
              <Header
                variant="h1"
                actions={
                  <SpaceBetween size='xs' direction='horizontal'>
                    <Button href={'/admin/bus/' + busId + '/edit'}>수정</Button>
                    <Button>삭제</Button>
                  </SpaceBetween>
                }
              >
                {studentName} 버스 정보
              </Header>
            }
          >
            <SpaceBetween size='l'>
              <Container
                header={<Header variant="h2">탑승 버스 정보</Header>}
              >
                 <ColumnLayout columns={2} variant="text-grid">
                  <SpaceBetween size='l'>
                    <div>
                      <Box variant="awsui-key-label">버스명</Box>
                      <div>대구 2호차</div>
                    </div>
                    <div>
                      <Box variant="awsui-key-label">설명</Box>
                      <div>석적 (부영아파트 앞 사거리) 경유</div>
                    </div>
                  </SpaceBetween>
                  <SpaceBetween size='l'>
                    <div>
                      <Box variant="awsui-key-label">종착지</Box>
                      <div>동대구역</div>
                    </div>
                    <div>
                      <Box variant="awsui-key-label">탑승 관리 인원</Box>
                      <div>임태현, 김윤현</div>
                    </div>
                  </SpaceBetween>
                </ColumnLayout>
              </Container>
              <Container
                header={<Header variant="h2">탑승인원 정보</Header>}
              >
                <CustomTable 
                  COLUMN_DEFINATIONS={COLUMN_DEFINATIONS}
                  FILTERING_PROPERTIES={FILTERING_PROPERTIES}
                  resourceName="학생"
                  datas={data}
                  pageVariant="borderless"
                  headerHidden={true}
                  onDelete={() => {}}
                />
              </Container>
            </SpaceBetween>
          </ContentLayout>
        }
      />
    </>
  )
}

export default BusDetail
