import "@cloudscape-design/global-styles/index.css"
import { CustomAppLayout } from "../../../components/admin/CustomLayout"
import { BreadcrumbGroup, ContentLayout, SpaceBetween, Form, Button, Header, Container, FormField, Select, Input } from "@cloudscape-design/components"
import UserType from "../../../interfaces/UserType"

function UserEdit(user: UserType) {
  const studentName = 'test'

  return (
    <>
      <CustomAppLayout
        contentType="table"
        breadcrumbs={<BreadcrumbGroup items={[{ text: "홈", href: "/admin" }, { text: "학생 목록", href: '/admin/user'}, { text: '학생 수정', href: window.location.pathname }]} />}
        content={
          <ContentLayout
            header={
              <Header
                variant="h1"
              >
                {studentName} 학생 정보 수정
              </Header>
            }
          >
            <form onSubmit={event => event.preventDefault()}>
              <Form
                actions={
                  <SpaceBetween direction="horizontal" size="xs">
                    <Button variant="link" href="/admin/user">
                      취소
                    </Button>
                    <Button data-testid="create" variant="primary">
                      변경사항 적용
                    </Button>
                  </SpaceBetween>
                }
                // errorText={errorText}
                errorIconAriaLabel="Error"
              >
                <Container header={<Header variant="h2">학생 정보</Header>}>
                  <SpaceBetween size="l">
                      <FormField
                        label="학번"
                        stretch={false}
                      >
                        <Input 
                          value="test"
                          type="number"
                        />
                      </FormField>
                      <FormField
                        label="이름"
                        stretch={false}
                      >
                        <Input 
                          value="test"
                        />
                      </FormField>
                      <FormField
                        label="전화번호"
                        stretch={false}
                      >
                        <Input 
                          value="test"
                        />
                      </FormField>
                      <FormField
                        label="탑승 버스"
                        stretch={false}
                      >
                        <Select 
                          selectedOption={{ label: '선택', value: '선택' }}
                        />
                      </FormField>
                      <FormField
                        label="도착 정류장"
                        stretch={false}
                      >
                        <Select 
                          selectedOption={{ label: '선택', value: '선택' }}
                        />
                      </FormField>
                  </SpaceBetween>
                </Container>
              </Form>
            </form>
          </ContentLayout>
        }
      />
    </>
  )
}

export default UserEdit
