import { defineRouteConfig } from "@medusajs/admin-sdk";
import { 
  Container,
  Heading,
  createDataTableColumnHelper,
  DataTable,
  DataTablePaginationState,
  useDataTable,
  StatusBadge,
  createDataTableCommandHelper,
  DataTableRowSelectionState,
  Toaster,
  toast,
  createDataTableFilterHelper,
  DataTableFilteringState,
  Button
} from "@medusajs/ui"

import { useMemo, useState } from "react";
import { sdk } from "../../lib/sdk";
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { ReateStars } from "../../components/rate-stars";
import { useNavigate } from "react-router-dom"
import { CreateFloristModal } from "../../controls/florist/create-florist-modal";
import { ShoppingBag } from "@medusajs/icons";

type Florist = {
  id: string
  name: string
  company_name: string
  address: string
  city: string
  county: string
  country: string
  zip_code: string
    
  main_phone: string
  second_phone: string
  email: string
    
  note: string
    
  close_time: string
  is_open: boolean
    
  image_url: string
      
  iban: string
    
  rate: number
    
  //florist_status: model.enum(FloristStatus).default(FloristStatus.PENDING),
  florist_status: "pending" | "approved" | "rejected"
  created_at: Date
  updated_at: Date
}

type FloristsResponse = {
  florists: Florist[]
  count: number
  limit: number
  offset: number

}

const columnHelper = createDataTableColumnHelper<Florist>()
const commandHelper = createDataTableCommandHelper()
const filterHelper = createDataTableFilterHelper<Florist>()


const columns = [
 /*
  columnHelper.accessor("id", {
    header: "ID",
  }),*/
  columnHelper.select(),

  columnHelper.accessor("name", {
    header: "Name",
    enableSorting: true,
  }),
  columnHelper.accessor("address", {
    header: "Address",
  }),
  columnHelper.accessor("city", {
    header: "City",
    enableSorting: true,
  }),
  columnHelper.accessor("county", {
    header: "County",
    enableSorting: true,
  }),
  columnHelper.accessor("main_phone", {
    header: "Phone",
  }),
  columnHelper.accessor("email", {
    header: "Email",
  }),
  
  columnHelper.accessor("rate", {
    header: "Rate",
    enableSorting: true,
     cell: ({ row }) => {
      return (
        <ReateStars repeatCount={row.original.rate} maxRate={5} />
      )
     },
  }),
  columnHelper.accessor("florist_status", {
    header: "Status",
    cell: ({ row }) => {
      const color = row.original.florist_status === "approved" ? 
        "green" : row.original.florist_status === "rejected" 
        ? "red" : "grey"
      return (
        <StatusBadge color={color}>
          {row.original.florist_status.charAt(0).toUpperCase() + row.original.florist_status.slice(1)}
        </StatusBadge>
      )
    },
  }),
]


const useCommands = (refetch: () => void) => {
  return [
    commandHelper.command({
      label: "Approve",
      shortcut: "A",
      action: async (selection) => {
        const floristsToApproveIds = Object.keys(selection)

        sdk.client.fetch("/admin/florists/status", {
          method: "POST",
          body: {
            ids: floristsToApproveIds,
            florist_status: "approved",
          },
        }).then(() => {
          toast.success("Florists approved")
          refetch()
        }).catch(() => {
          toast.error("Failed to approve Florists")
        })
      },
    }),
    commandHelper.command({
      label: "Reject",
      shortcut: "R",
      action: async (selection) => {
        const floristsToApproveIds = Object.keys(selection)

        sdk.client.fetch("/admin/florists/status", {
          method: "POST",
          body: {
            ids: floristsToApproveIds,
            florist_status: "rejected",
          },
        }).then(() => {
          toast.success("Florists rejected")
          refetch()
        }).catch(() => {
          toast.error("Failed to reject Florists")
        })
      },
    }),
  ]
}

const filters = [
  filterHelper.accessor("florist_status", {
    type: "select",
    label: "Status",
    options: [
      {
        label: "Pending",
        value: "pending",
      },
      {
        label: "Approved",
        value: "approved",
      },
      {
        label: "Reject",
        value: "reject",
      },
    ],
  }),
]



const limit = 15


const FloristsPage = () => {

  const [isModalOpen, setIsModalOpen] = useState(false)
  const queryClient = useQueryClient()

  const [pagination, setPagination] = useState<DataTablePaginationState>({
    pageSize: limit,
    pageIndex: 0,
  })

  const offset = useMemo(() => {
    return pagination.pageIndex * limit
  }, [pagination])

  const [filtering, setFiltering] = useState<DataTableFilteringState>({})

  const statusFilters = useMemo(() => {
    return (filtering.status || []) as Florist
  }, [filtering])


  const { data, isLoading, refetch } = useQuery<{
      florists: Florist[]
      count: number
      limit: number
      offset: number
      status: Florist,
    }>({
      queryKey: ["florists", offset, limit],
      queryFn: () => sdk.client.fetch("/admin/florists", {
        query: {
          offset: pagination.pageIndex * pagination.pageSize,
          limit: pagination.pageSize,
          order: "created_at ",
          filters: statusFilters
        },
      }),
    })

  const [rowSelection, setRowSelection] = useState<DataTableRowSelectionState>({})
  const commands = useCommands(refetch)
  const navigate = useNavigate()

  const table = useDataTable({
    columns,
    data: data?.florists || [],
    rowCount: data?.count || 0,
    isLoading,
    pagination: {
      state: pagination,
      onPaginationChange: setPagination,
    },
    getRowId: (row) => row.id,

    commands,
     rowSelection: {
        state: rowSelection,
        onRowSelectionChange: setRowSelection,
      },
    onRowClick: (event, row) => {
      // Handle row click, for example
      navigate(`/florists/${row.id}`)
    },
    filters

  })


  const handleCloseModal = () => {
      setIsModalOpen(false)
  }

  const handleCreateFlorist = async (data: any) => {

    try {
      await sdk.client.fetch("/admin/florists", {
        method: "POST",
        body: data,
      })
      queryClient.invalidateQueries({ queryKey: ["florist"] })
      handleCloseModal()
      refetch()

    } catch (error: any) {
      toast.error(`Failed to create florist: ${error.message}`)
    }
  }

  
  return (
    <Container className="divide-y p-0">

      <DataTable instance={table}>
        <DataTable.Toolbar className="flex flex-col items-start justify-between gap-2 md:flex-row md:items-center">
          <Heading>Florists</Heading>
           <Button
            variant="secondary"
            onClick={() => setIsModalOpen(true)}
          >
            New Florist
          </Button>
        </DataTable.Toolbar>
        <DataTable.Table />
        <DataTable.Pagination />
        <DataTable.CommandBar selectedLabel={(count) => `${count} selected`} />
      </DataTable>
      <Toaster />
      <CreateFloristModal
        open={isModalOpen}
        onOpenChange={handleCloseModal}
        onSubmit={handleCreateFlorist}
      />
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Florists",
  icon: ShoppingBag,
});

export default FloristsPage;