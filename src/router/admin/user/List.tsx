import "@cloudscape-design/global-styles/index.css"
import { CustomAppLayout } from "../../../components/admin/CustomLayout"
import { BreadcrumbGroup, Button, Flashbar, TableProps, Modal, Box, SpaceBetween, Alert, ColumnLayout, Input, FormField } from "@cloudscape-design/components"
import UserType from "../../../interfaces/UserType"
import CustomTable from "../../../components/admin/CustomTable"
import { Link } from "react-router-dom"
import { FormEvent, useEffect, useState } from "react"
import { PropertyFilterProperty } from "@cloudscape-design/collection-hooks"
import UserListType from "../../../interfaces/UserListType"
import useNotifications from "../../../hooks/useNotifications"

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
  }
]

const tempData: UserType[] = [
  {
    id: 1,
    studentId: '3111',
    name: "김철수",
    phone_number: '01037290245',
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
    bus: item.boarding?.name ?? '',
    busId: item.boarding?.id ?? '',
    station: item.destination?.name ?? '',
    stationId: item.destination?.id ?? ''
  }
}) as UserListType[]

function UserList() {
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedItems, setSelectedItems] = useState<UserListType[]>([])

  const { clearFailed, notifications, notifyDeleted, notifyInProgress } = useNotifications({
    resourceName: '학생'
  })

  return (
    <>
      <CustomAppLayout
        contentType="table"
        notifications={<Flashbar items={notifications} stackItems={true} />}
        breadcrumbs={<BreadcrumbGroup items={[{ text: "홈", href: "/admin" }, { text: '학생 목록', href: '/admin/user' }]} />}
        content={
          <CustomTable
            COLUMN_DEFINATIONS={COLUMN_DEFINATIONS}
            FILTERING_PROPERTIES={FILTERING_PROPERTIES}
            datas={data}
            selectedItems={selectedItems}
            onSelectionChange={event => setSelectedItems(event.detail.selectedItems)}
            onDelete={() => {}}
            actionButtons={
              <>
                <Button data-testid="header-btn-view-details" disabled={selectedItems.length !== 1} onClick={() => {
                  if (selectedItems.length !== 1) return
                  window.location.href = '/admin/user/' + selectedItems[0].id
                }}>
                  상세보기
                </Button>
                <Button data-testid="header-btn-edit" disabled={selectedItems.length !== 1} onClick={() => {
                  if (selectedItems.length !== 1) return
                  window.location.href = '/admin/user/' + selectedItems[0].id + '/edit'
                }}>
                  수정
                </Button>
                <Button data-testid="header-btn-delete" disabled={selectedItems.length === 0} onClick={() => setShowDeleteModal(true)}>
                  삭제
                </Button>
                <Button data-testid="header-btn-create" variant="primary" href="/admin/user/create">
                  학생 추가
                </Button>
              </>
            }
            titleText="학생 목록"
            resourceName="학생"
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


function DeleteModal({ selections, visible, onDiscard, onDelete }: { selections: UserListType[], visible: boolean, onDiscard: () => void, onDelete: () => void }) {
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

export default UserList
