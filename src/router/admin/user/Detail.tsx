import "@cloudscape-design/global-styles/index.css"
import { CustomAppLayout } from "../../../components/admin/CustomLayout"
import { BreadcrumbGroup, ContentLayout, SpaceBetween, Button, Header, ColumnLayout, Box, Container } from "@cloudscape-design/components"
import { useParams } from "react-router-dom"
import { Map, MapMarker } from 'react-kakao-maps-sdk'
import { useState, useEffect, ReactNode } from "react"
import UserType from "../../../interfaces/UserType"

function UserDetail(user: UserType) {
  const studentName = 'test'
  const { userId } = useParams()
  const [map, setMap] = useState<kakao.maps.Map>()
  const [marker, setMarker] = useState<ReactNode>()

  useEffect(() => {
    if (!map) return
    const ps = new kakao.maps.services.Places()

    ps.keywordSearch("경상북도 칠곡군 석적읍 석적로 955-19", (data, status) => {
      if (status === kakao.maps.services.Status.OK) {
        if (data.length === 0) return
        const place = data[0]

        map.setCenter(new kakao.maps.LatLng(Number(place.y), Number(place.x)))
        setMarker(
          <MapMarker
            position={{lat: Number(place.y), lng: Number(place.x)}}
          />
        )
      }
    })
  }, [map])

  return (
    <>
      <CustomAppLayout
        contentType="table"
        breadcrumbs={<BreadcrumbGroup items={[{ text: "홈", href: "/admin" }, { text: "학생 목록", href: '/admin/user'}, { text: '학생 추가', href: '/admin/user/create' }]} />}
        content={
          <ContentLayout
            header={
              <Header
                variant="h1"
                actions={
                  <SpaceBetween size='xs' direction='horizontal'>
                    <Button href={'/admin/user/' + userId + '/edit'}>수정</Button>
                    <Button>삭제</Button>
                  </SpaceBetween>
                }
              >
                {studentName} 학생 정보
              </Header>
            }
          >
            <SpaceBetween size='l'>
              <Container
                header={
                  <Header variant="h2">학생 정보</Header>
                }
              >
                <ColumnLayout columns={2} variant="text-grid">
                  <SpaceBetween size='l'>
                    <div>
                      <Box variant="awsui-key-label">학번</Box>
                      <div>3111</div>
                    </div>
                    <div>
                      <Box variant="awsui-key-label">이름</Box>
                      <div>임태현</div>
                    </div>
                    <div>
                      <Box variant="awsui-key-label">전화번호</Box>
                      <div>01037290245</div>
                    </div>
                  </SpaceBetween>
                  <SpaceBetween size='l'>
                    <div>
                      <Box variant="awsui-key-label">탑승 버스</Box>
                      <div>대구 2호차</div>
                    </div>
                    <div>
                      <Box variant="awsui-key-label">하차 정류장</Box>
                      <div>석적 (부영아파트 앞 사거리)</div>
                    </div>
                  </SpaceBetween>
                </ColumnLayout>
              </Container>
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
                header={<Header variant="h2">하차 정류장 정보</Header>}
              >
                 <ColumnLayout columns={2} variant="text-grid">
                  <SpaceBetween size='l'>
                    <div>
                      <Box variant="awsui-key-label">하차지점</Box>
                      <div>석적</div>
                    </div>
                    <div>
                      <Box variant="awsui-key-label">주소</Box>
                      <div>경상북도 칠곡군 석적읍 석적로 955-19</div>
                    </div>
                  </SpaceBetween>
                  <Map
                    center={{
                      lat: 37.566826,
                      lng: 126.9786567,
                    }}
                    onCreate={setMap}
                    style={{
                      width: '100%',
                      height: '30vh'
                    }}
                  >
                    {marker}
                  </Map>
                </ColumnLayout>
              </Container>
            </SpaceBetween>
          </ContentLayout>
        }
      />
    </>
  )
}

export default UserDetail
