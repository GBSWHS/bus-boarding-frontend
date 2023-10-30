import "@cloudscape-design/global-styles/index.css"
import { CustomAppLayout } from "../../../components/admin/CustomLayout"
import { BreadcrumbGroup, ContentLayout, SpaceBetween, Form, Button, Header, Container, FormField, Input } from "@cloudscape-design/components"
import DaumPostcodeEmbed from 'react-daum-postcode'
import { useState } from "react"
import UserType from "../../../interfaces/UserType"

function StationEdit(user: UserType) {
  const [location, setLocation] = useState<string | null>(null)
  const handleComplete = (data: { address: string, addressType: 'R' | 'J', bname: string, buildingName: string }) => {
    let fullAddress = data.address
    let extraAddress = ''

    if (data.addressType === 'R') {
      if (data.bname !== '') {
        extraAddress += data.bname
      }
      if (data.buildingName !== '') {
        extraAddress += extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName
      }
      fullAddress += extraAddress !== '' ? ` (${extraAddress})` : ''
    }

    setLocation(fullAddress)
  }

  return (
    <>
      <CustomAppLayout
        contentType="table"
        breadcrumbs={<BreadcrumbGroup items={[{ text: "홈", href: "/admin" }, { text: "정류장 목록", href: '/admin/station'}, { text: '정류장 수정', href: window.location.pathname }]} />}
        content={
          <ContentLayout
            header={
              <Header
                variant="h1"
              >
              {'test'} 정류장 수정
              </Header>
            }
          >
            <form onSubmit={event => event.preventDefault()}>
              <Form
                actions={
                  <SpaceBetween direction="horizontal" size="xs">
                    <Button variant="link" href="/admin/station">
                      취소
                    </Button>
                    <Button data-testid="create" variant="primary">
                      변경사항 적용
                    </Button>
                  </SpaceBetween>
                }
                errorIconAriaLabel="Error"
              >
                <SpaceBetween size="l">
                  <Container header={<Header variant="h2">정류장 정보</Header>}>
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
                      <FormField
                        label={"정류장 " + (location ? '위치' : '검색')}
                        stretch={false}
                      >
                        {!location && (<DaumPostcodeEmbed onComplete={handleComplete} autoClose={false} />)}
                        {location}{location && (<Button variant='link' onClick={() => setLocation(null)}>다시 검색</Button>)}
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

export default StationEdit
