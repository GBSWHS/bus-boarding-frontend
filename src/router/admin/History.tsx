import "@cloudscape-design/global-styles/index.css"
import { CustomAppLayout } from "../../components/admin/CustomLayout"
import { BreadcrumbGroup, Flashbar, Header, SplitPanel, Table, TableProps } from "@cloudscape-design/components"
import CustomTable from "../../components/admin/CustomTable"
import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import { PropertyFilterProperty } from "@cloudscape-design/collection-hooks"
import useNotifications from "../../hooks/useNotifications"
import moment from 'moment'
import HistoryListType from "../../interfaces/HistoryListType"
import UserType from "../../interfaces/UserType"

const COLUMN_DEFINATIONS: TableProps.ColumnDefinition<HistoryListType>[] = [
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
    id: 'timestamp',
    header: '승차 시각',
    cell: item => moment(item.timestamp).format('YYYY-MM-DD HH:mm:ss'),
    sortingField: 'timestamp'
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
    propertyLabel: '승차 시각',
    key: 'timestamp',
    groupValuesLabel: '승차 시각',
    operators: ['=', ':', '>', "<", ">=", "<="]
  },
]

const COLUMN_DEFINITIONS_PANEL: TableProps.ColumnDefinition<HistoryListType>[] = [
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
    id: 'timestamp',
    header: '승차 시각',
    cell: item => moment(item.timestamp).format('YYYY-MM-DD HH:mm:ss'),
    sortingField: 'timestamp'
  }
];

const tempData: HistoryListType[] = Array.from({ length: 100 }, (_, index) => ({
  id: index, studentId: '2019111111', name: '홍길동', busId: 1, bus: '대구 1호차', stationId: 1, station: '수원역', timestamp: new Date()
}))

const useSplitPanel = (selectedItem?: HistoryListType) => {
  const [splitPanelSize, setSplitPanelSize] = useState<number>(300);
  const [splitPanelOpen, setSplitPanelOpen] = useState<boolean>(false);
  const [hasManuallyClosedOnce, setHasManuallyClosedOnce] = useState<boolean>(false);

  const onSplitPanelResize = ({ detail: { size } }: { detail: { size: number } }) => {
    setSplitPanelSize(size);
  };

  const onSplitPanelToggle = ({ detail: { open } }: { detail: { open: boolean } }) => {
    setSplitPanelOpen(open);

    if (!open) {
      setHasManuallyClosedOnce(true);
    }
  };

  useEffect(() => {
    if (selectedItem && !hasManuallyClosedOnce) {
      setSplitPanelOpen(true);
    }
  }, [selectedItem, hasManuallyClosedOnce]);

  return {
    splitPanelOpen,
    onSplitPanelToggle,
    splitPanelSize,
    onSplitPanelResize,
  };
};

function HistoryList(user: UserType) {
  const [selectedItems, setSelectedItems] = useState<HistoryListType[]>([])

  const { clearFailed, notifications, notifyDeleted, notifyInProgress } = useNotifications({
    resourceName: '탑승'
  })

  const { splitPanelOpen, onSplitPanelToggle, splitPanelSize, onSplitPanelResize } = useSplitPanel(selectedItems.length > 0 ? selectedItems[0] : undefined);

  return (
    <>
      <CustomAppLayout
        contentType="table"
        notifications={<Flashbar items={notifications} stackItems={true} />}
        breadcrumbs={<BreadcrumbGroup items={[{ text: "홈", href: "/admin" }, { text: '탑승 기록', href: '/admin/station' }]} />}
        splitPanelOpen={splitPanelOpen}
        onSplitPanelToggle={onSplitPanelToggle}
        splitPanelSize={splitPanelSize}
        onSplitPanelResize={onSplitPanelResize}
        splitPanel={<SplitPanel header={'자세히 보기'} hidePreferencesButton={true}>
          <Table
            header={
              <Header variant="h2">
                탑승 정보
              </Header>
            }
            columnDefinitions={COLUMN_DEFINITIONS_PANEL}
            items={selectedItems}
            variant={'borderless'}
          ></Table>
        </SplitPanel>}
        content={
          <CustomTable
            selectionType="single"
            COLUMN_DEFINATIONS={COLUMN_DEFINATIONS}
            FILTERING_PROPERTIES={FILTERING_PROPERTIES}
            datas={tempData}
            selectedItems={selectedItems}
            onSelectionChange={event => setSelectedItems(event.detail.selectedItems)}
            titleText="탑승 기록"
            resourceName="탑승"
          />
        }
      />
    </>
  )
}

export default HistoryList
