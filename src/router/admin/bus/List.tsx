import "@cloudscape-design/global-styles/index.css"
import { CustomAppLayout } from "../../../components/admin/CustomLayout"
import { BreadcrumbGroup, Button, Flashbar, Modal, Box, SpaceBetween, Alert, ColumnLayout, Input, FormField, CardsProps, ProgressBar } from "@cloudscape-design/components"
import { Link } from "react-router-dom"
import { FormEvent, useEffect, useState } from "react"
import { PropertyFilterProperty } from "@cloudscape-design/collection-hooks"
import useNotifications from "../../../hooks/useNotifications"
import CustomCard from "../../../components/admin/CustomCard"
import BusListType from "../../../interfaces/BusListType"
import { fetcher } from "../../../common/fetcher"
import useSWR from "swr"

const COLUMN_DEFINATIONS: CardsProps.CardDefinition<BusListType> = {
  header: item => <Link to={`/admin/bus/` + item.id}>{item.name}</Link>,
  sections: [
    {
      id: 'description',
      header: '',
      content: item => item.description
    },
    {
      id: 'status',
      header: '현재 탑승률',
      content: item => <>
        <Box variant="p" color="inherit">
          {item.userCount}명 중 {item.enterUserCount}명 탑승 완료
        </Box>
        <ProgressBar value={item.enterUserCount / item.userCount * 100} />
      </>
    }
  ]
}

const FILTERING_PROPERTIES: PropertyFilterProperty[] = [
  {
    propertyLabel: '이름',
    key: 'name',
    groupValuesLabel: '이름',
    operators: ['=', ':']
  },
  {
    propertyLabel: '설명',
    key: 'description',
    groupValuesLabel: '설명',
    operators: ['=', ':']
  }
]

function BusList() {
  const { data, error, isLoading } = useSWR('/api/bus', fetcher)

  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedItems, setSelectedItems] = useState<BusListType[]>([])

  const { clearFailed, notifications, notifyDeleted, notifyInProgress } = useNotifications({
    resourceName: '학생'
  })

  if (error) return <CustomAppLayout contentType="table" />

  return (
    <>
      <CustomAppLayout
        contentType="table"
        notifications={<Flashbar items={notifications} stackItems={true} />}
        breadcrumbs={<BreadcrumbGroup items={[{ text: "홈", href: "/admin" }, { text: '버스 목록', href: '/admin/bus' }]} />}
        content={
          <CustomCard
            COLUMN_DEFINATIONS={COLUMN_DEFINATIONS}
            FILTERING_PROPERTIES={FILTERING_PROPERTIES}
            datas={data ?? []}
            loading={isLoading}
            selectedItems={selectedItems}
            onSelectionChange={event => setSelectedItems(event.detail.selectedItems)}
            onDelete={() => {}}
            actionButtons={
              <>
                <Button data-testid="header-btn-view-details" disabled={selectedItems.length !== 1} onClick={() => {
                  if (selectedItems.length !== 1) return
                  window.location.href = '/admin/bus/' + selectedItems[0].id
                }}>
                  상세보기
                </Button>
                <Button data-testid="header-btn-edit" disabled={selectedItems.length !== 1} onClick={() => {
                  if (selectedItems.length !== 1) return
                  window.location.href = '/admin/bus/' + selectedItems[0].id + '/edit'
                }}>
                  수정
                </Button>
                <Button data-testid="header-btn-delete" disabled={selectedItems.length === 0} onClick={() => setShowDeleteModal(true)}>
                  삭제
                </Button>
                <Button data-testid="header-btn-create" variant="primary" href="/admin/bus/create">
                  버스 추가
                </Button>
              </>
            }
            titleText="버스 목록"
            resourceName="버스"
          />
        }
      />
      <DeleteModal
        visible={showDeleteModal}
        selections={selectedItems}
        onDiscard={() => setShowDeleteModal(false)}
        onDelete={() => {
          notifyInProgress(selectedItems)
          setShowDeleteModal(false)
          clearFailed(selectedItems[0])
          notifyDeleted(selectedItems)
          notifyInProgress([])
        }}
      />
    </>
  )
}


function DeleteModal({ selections, visible, onDiscard, onDelete }: { selections: BusListType[], visible: boolean, onDiscard: () => void, onDelete: () => void }) {
  const deleteConsentText = 'confirm'

  const [deleteInputText, setDeleteInputText] = useState('')
  useEffect(() => {
    setDeleteInputText('')
  }, [visible])

  const handleDeleteSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (inputMatchesConsentText) {
      onDelete()
    }
  }

  const isMultiple = selections.length > 1
  const inputMatchesConsentText = deleteInputText.toLowerCase() === deleteConsentText

  return (
    <Modal
      visible={visible}
      onDismiss={onDiscard}
      header={'학생 삭제'}
      closeAriaLabel="Close dialog"
      footer={
        <Box float="right">
          <SpaceBetween direction="horizontal" size="xs">
            <Button variant="link" onClick={onDiscard}>
              취소
            </Button>
            <Button variant="primary" onClick={onDelete} disabled={!inputMatchesConsentText} data-testid="submit">
              삭제
            </Button>
          </SpaceBetween>
        </Box>
      }
    >
      {selections.length > 0 && (
        <SpaceBetween size="m">
          {isMultiple ? (
            <Box variant="span">
              <Box variant="span" fontWeight="bold">
                {selections.length}명
              </Box>
              이 삭제되며, 이 행동을 되돌릴 수 없습니다.
            </Box>
          ) : (
            <Box variant="span">
              <Box variant="span" fontWeight="bold">
                {selections[0].name}
              </Box>
              (이)가 삭제되며, 이 행동을 되돌릴 수 없습니다.
            </Box>
          )}

          <Alert type="warning" statusIconAriaLabel="Warning">
            이 작업을 실행하면
            {isMultiple ? ' 다수의 학생 데이터가 ' : ' 학생 데이터가 '}
            지워집니다.
          </Alert>

          <Box>실수로 발생할수 있는 삭제 방지를 위해 확인 요청이 필요합니다.</Box>

          <form onSubmit={handleDeleteSubmit}>
            <FormField label={`본인이 하고자 하는 행동이 확실하다면, "${deleteConsentText}"를 아래에 입력하세요.`}>
              <ColumnLayout columns={2}>
                <Input
                  placeholder={deleteConsentText}
                  onChange={event => setDeleteInputText(event.detail.value)}
                  value={deleteInputText}
                  ariaRequired={true}
                />
              </ColumnLayout>
            </FormField>
          </form>
        </SpaceBetween>
      )}
    </Modal>
  )
}

export default BusList
