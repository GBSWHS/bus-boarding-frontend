import "@cloudscape-design/global-styles/index.css"
import { CustomAppLayout } from "../../../components/admin/CustomLayout"
import { BreadcrumbGroup, ContentLayout, SpaceBetween, Button, Header, ColumnLayout, Box, Container } from "@cloudscape-design/components"
import { useParams } from "react-router-dom"
import { Map, MapMarker } from 'react-kakao-maps-sdk'
import { useState, useEffect, ReactNode } from "react"

function StationDetail() {
  const studentName = 'test'
  const { stationId } = useParams()
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
        breadcrumbs={<BreadcrumbGroup items={[{ text: "홈", href: "/admin" }, { text: "정류장 목록", href: '/admin/station'}, { text: '정류장 추가', href: '/admin/station/create' }]} />}
        content={
          <ContentLayout
            header={
              <Header
                variant="h1"
                actions={
                  <SpaceBetween size='xs' direction='horizontal'>
                    <Button href={'/admin/station/' + stationId + '/edit'}>수정</Button>
                    <Button>삭제</Button>
                  </SpaceBetween>
                }
              >
                {studentName} 정류장 정보
              </Header>
            }
          >
            <SpaceBetween size='l'>
              <Container
                header={<Header variant="h2">정류장 정보</Header>}
              >
                 <ColumnLayout columns={2} variant="text-grid">
                  <SpaceBetween size='l'>
                    <div>
                      <Box variant="awsui-key-label">정류장 이름</Box>
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

export default StationDetail
