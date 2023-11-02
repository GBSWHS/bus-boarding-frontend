/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCollection } from "@cloudscape-design/collection-hooks"
import { Box, Button, SpaceBetween, Table, TableProps, Header, Pagination, NonCancelableCustomEvent, PropertyFilter } from "@cloudscape-design/components"
import { PropertyFilterProperty } from '@cloudscape-design/collection-hooks'

const TableNoMatchState = ({ onClearFilter }: { onClearFilter: () => void }) => (
  <Box margin={{ vertical: 'xs' }} textAlign="center" color="inherit">
    <SpaceBetween size="xxs">
      <div>
        <b>일치하는 항목을 찾을 수 없습니다.</b>
        <Box variant="p" color="inherit">
          해당 항목을 찾을 수 없습니다.
        </Box>
      </div>
      <Button onClick={onClearFilter}>필터 초기화</Button>
    </SpaceBetween>
  </Box>
)

const TableEmptyState = ({ resourceName }: { resourceName: string }) => (
  <Box margin={{ vertical: 'xs' }} textAlign="center" color="inherit">
    <SpaceBetween size="xxs">
      <div>
        <b>{resourceName.toLowerCase()} 목록</b>
        <Box variant="p" color="inherit">
          {resourceName.toLowerCase()} 목록이 비어있습니다.
        </Box>
      </div>
      <Button>{resourceName.toLowerCase()} 추가</Button>
    </SpaceBetween>
  </Box>
)

interface CustomTableProps {
  titleText?: string
  resourceName: string
  actionButtons?: React.ReactNode
  FILTERING_PROPERTIES: PropertyFilterProperty[]
  COLUMN_DEFINATIONS: TableProps.ColumnDefinition<any>[]
  datas: any[]
  selectedItems?: any[]
  onSelectionChange?: (event: NonCancelableCustomEvent<TableProps.SelectionChangeDetail<any>>) => void
  onDelete?: () => void,
  selectionType?: TableProps.SelectionType,
  pageVariant?: TableProps.Variant
  headerHidden?: boolean
  loading: boolean
}

function CustomTable ({ headerHidden=false, selectionType='multi', pageVariant='full-page', titleText, resourceName, actionButtons, FILTERING_PROPERTIES, COLUMN_DEFINATIONS, datas, selectedItems, onSelectionChange, loading }: CustomTableProps) {
  const { items, actions, filteredItemsCount, collectionProps, paginationProps, propertyFilterProps } = useCollection(
    datas,
    {
      propertyFiltering: {
        filteringProperties: FILTERING_PROPERTIES,
        empty: <TableEmptyState resourceName={resourceName ?? ''} />,
        noMatch: <TableNoMatchState onClearFilter={() => {
          actions.setPropertyFiltering({ tokens: [], operation: 'and' })
        }} />,
      },
      pagination: { pageSize: 30 },
      sorting: { defaultState: { sortingColumn: COLUMN_DEFINATIONS[0] } },
      selection: {}
    }
  )

  return (
    <Table
      {...collectionProps}
      selectedItems={selectedItems}
      onSelectionChange={onSelectionChange}
      columnDefinitions={COLUMN_DEFINATIONS} // wrap COLUMN_DEFINATIONS in an array
      items={items} // add items prop
      loading={loading}
      selectionType={selectionType}
      variant={pageVariant}
      stickyHeader={true}
      resizableColumns={true}
      header={
        !headerHidden && <Header
        variant="awsui-h1-sticky"
        actions={
          <SpaceBetween size="xs" direction="horizontal">
            {actionButtons}
          </SpaceBetween>
        }
      >
        {titleText}
      </Header>
      }
      filter={
        <PropertyFilter
          {...propertyFilterProps}
          countText={`${datas.length}개 중 ${filteredItemsCount}개`}
          expandToViewport={true}
          i18nStrings={{
            filteringPlaceholder: '값 검색',
            groupValuesText: '값',
            groupPropertiesText: '속성',
            operatorsText: '연산자',
            operationAndText: '그리고',
            operationOrText: '또는',
            operatorLessText: '작다',
            operatorLessOrEqualText: '작거나 같다',
            operatorGreaterText: '크다',
            operatorGreaterOrEqualText: '크거나 같다',
            operatorContainsText: '포함',
            operatorDoesNotContainText: '포함하고 있지 않다',
            operatorEqualsText: '같다',
            operatorDoesNotEqualText: '같지않다',
            operatorStartsWithText: '로 시작된다',
            editTokenHeader: '나가기',
            propertyText: '속성',
            operatorText: '연산자',
            valueText: '값',
            cancelActionText: '취소',
            applyActionText: '적용',
            allPropertiesLabel: '속성',
            clearFiltersText: '필터 초기화',
            enteredTextLabel: (token: any) => `검색: "${token}"`,
          }}
        />
      }
      pagination={<Pagination {...paginationProps}/>}
    />
  )
}

export default CustomTable
