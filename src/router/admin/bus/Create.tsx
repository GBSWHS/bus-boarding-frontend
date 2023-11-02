import "@cloudscape-design/global-styles/index.css"
import { CustomAppLayout } from "../../../components/admin/CustomLayout"
import { BreadcrumbGroup, ContentLayout, SpaceBetween, Form, Button, Header, Container, FormField, Select, Input, Cards, TableProps } from "@cloudscape-design/components"
import { Link } from "react-router-dom"
import CustomTable from "../../../components/admin/CustomTable"
import { PropertyFilterProperty } from "@cloudscape-design/collection-hooks"
import UserListType from "../../../interfaces/UserListType"
import UserType from "../../../interfaces/UserType"
import { useState } from "react"

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
  }
]

const tempData: UserType[] = [
  {
    id: 1,
    studentId: '3111',
    name: "김철수",
    phone_number: '01037290245'
  },
  {
    id: 2,
    studentId: '3112',
    name: "김철수",
    phone_number: '01037290245'
  }
]

function BusCreate() {
  const [selectedItems, setSelectedItems] = useState<UserType[]>([])
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
              >
                버스 추가
              </Header>
            }
          >
            <form onSubmit={event => event.preventDefault()}>
              <Form
                actions={
                  <SpaceBetween direction="horizontal" size="xs">
                    <Button variant="link" href="/admin/bus">
                      취소
                    </Button>
                    <Button data-testid="create" variant="primary">
                      버스 추가
                    </Button>
                  </SpaceBetween>
                }
                errorIconAriaLabel="Error"
              >
                <SpaceBetween size="l">
                  <Container header={<Header variant="h2">버스 정보</Header>}>
                    <SpaceBetween size="l">
                      <FormField
                        label="이름"
                        stretch={false}
                      >
                        <Input 
                          value="test"
                          placeholder="대구 1호차"
                        />
                      </FormField>
                      <FormField
                        label="설명"
                        stretch={false}
                      >
                        <Input 
                          value="test"
                        />
                      </FormField>
                    </SpaceBetween>
                  </Container>
                  <Container header={<Header variant="h2">관리인원</Header>}>
                    <SpaceBetween size='l'>
                      <FormField
                        label="학생 추가"
                        stretch={true}
                      >
                        <CustomTable
                          pageVariant="borderless"
                          datas={tempData}
                          loading={false}
                          COLUMN_DEFINATIONS={COLUMN_DEFINATIONS}
                          FILTERING_PROPERTIES={FILTERING_PROPERTIES}
                          resourceName="학생"
                          actionButtons={<></>}
                          selectedItems={selectedItems}
                          headerHidden={true}
                          onSelectionChange={(items) => setSelectedItems(items.detail.selectedItems)}
                        />
                      </FormField>
                    </SpaceBetween>
                  </Container>
                  <Container header={<Header variant="h2">정류장</Header>}>
                    <SpaceBetween size='l'>
                      <FormField
                        label="정류장 검색"
                        stretch={true}
                      >
                        <SpaceBetween size='xs' direction="horizontal">
                          <Select
                            selectedOption={{ label: '수원역', value: '1' }}
                            options={[
                              { label: '수원역', value: '1' }
                            ]}
                          />
                          <Button variant="primary">추가</Button>
                        </SpaceBetween>
                      </FormField>
                      <FormField
                        label="추가된 정류장"
                        stretch={true}
                      >
                        <Cards
                          items={[
                            { id: 1, name: '수원역', order: 1, location: '수원시' },
                            { id: 2, name: '대구역', order: 2, location: '대구역' }
                          ]}
                          cardDefinition={{
                            header: item => <Link to={`/admin/bus/${item.id}`}>{item.name}</Link>,
                            sections: [
                              { id: 'order', header: '정류장 도착 순서', content: item => item.order },
                              { id: 'location', header: '정류장 위치', content: item => item.location },
                              { id: 'delete', header: '', content: item => <Button variant="primary" fullWidth={true}>{item.name} 삭제하기</Button> }
                            ]
                          }}
                        />
                      </FormField>
                    </SpaceBetween>
                  </Container>
                </SpaceBetween>
              </Form>
            </form>
          </ContentLayout>
        }
      />
    </>
  )
}

export default BusCreate
