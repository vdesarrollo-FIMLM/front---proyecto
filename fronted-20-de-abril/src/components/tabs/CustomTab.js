import MuiTab from '@mui/material/Tab'
import MuiTabList from '@mui/lab/TabList'
import { styled } from '@mui/material/styles'

export const CustomTab = styled(MuiTab)(({ theme }) => ({
  minHeight: 48,
  flexDirection: 'row',
  '& svg': {
    marginBottom: '0 !important',
    marginRight: theme.spacing(1)
  }
}))

export const CustomTabList = styled(MuiTabList)(({ theme }) => ({
  '& .MuiTabs-indicator': {
    display: 'none'
  },
  '& .Mui-selected': {
    backgroundColor: theme.palette.primary.main,
    color: `${theme.palette.common.white} !important`
  },
  '& .MuiTab-root': {
    minWidth: 65,
    minHeight: 38,
    borderRadius: theme.shape.borderRadius,
    [theme.breakpoints.up('sm')]: {
      minWidth: 130
    }
  }
}))

export const TabListColor = styled(MuiTabList)(({ theme }) => ({
  //backgroundColor: theme.palette.divider,
  //backgroundColor: theme.palette.grey[100],
  borderBottom: `1px solid ${theme.palette.divider}`,

  //borderRadius: 10,
  '& .MuiTabs-indicator': {
    display: 'none'
  },
  '& .Mui-selected': {
    backgroundColor: theme.palette.primary.main,
    color: `${theme.palette.common.white} !important`
  },
  '& .MuiTab-root': {
    minWidth: 65,
    minHeight: 38,
    margin: 3,
    marginBottom: 10,

    //borderRadius: `0px 0px 8px 8px`,

    borderRadius: theme.shape.borderRadius,
    [theme.breakpoints.up('sm')]: {
      minWidth: 130
    },

    '&:not(.Mui-selected)': {
      border: `1px solid ${theme.palette.divider}`,
      backgroundColor: theme.palette.grey[100],
      '&:hover': {
        backgroundColor: `${theme.palette.primary.main}32`
      }
    }
  }
}))

export const TabListColor2 = styled(MuiTabList)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: 10,

  '& .MuiTabs-flexContainer': {
    paddingLeft: 6
  },
  '& .MuiTabs-indicator': {
    display: 'none'
  },
  '& .Mui-selected': {
    backgroundColor: theme.palette.primary.main,
    color: `${theme.palette.common.white} !important`
  },
  '& .MuiTab-root': {
    minWidth: 65,
    minHeight: 38,

    //borderRadius: theme.shape.borderRadius,

    borderRadius: `8px 8px 0px 0px `,
    [theme.breakpoints.up('sm')]: {
      minWidth: 130
    },
    '&:not(.Mui-selected)': {
      border: `1px solid ${theme.palette.divider}`,
      backgroundColor: theme.palette.grey[100]
    }
  }
}))
