import React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTachometerAlt,
  faHospital,
  faStethoscope,
  faUserMd,
  faUsers,
  faCalendarCheck,
  faShoppingCart,
  faCog,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const drawerWidth = 240;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  })
);

const gradient = "#fff"; // Nền trắng cho header và sidebar

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  background: "#fff",
  color: "#2196f3",
  boxShadow: "0 2px 8px 10px rgba(33,150,243,0.15)", // Shadow xanh base-color
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

// Danh sách menu chính
const mainMenu = [
  { text: "Dashboard", icon: faTachometerAlt, to: "/dashboard" },
  { text: "Facilities", icon: faHospital, to: "/facilities" },
  { text: "Specialties", icon: faStethoscope, to: "/specialties" },
  { text: "Doctors", icon: faUserMd, to: "/doctors" },
  { text: "Users", icon: faUsers, to: "/users" },
  { text: "Appointments", icon: faCalendarCheck, to: "/appointments" },
  { text: "Purchase", icon: faShoppingCart, to: "/purchase" },
];

// Danh sách menu phụ
const subMenu = [{ text: "Setting", icon: faCog }];

export default function Header({ children }) {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar className="w-full">
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              mr: 2,
              ...(open && { display: "none" }),
              color: "#2196f3", // Nút menu màu xanh base-color
              backgroundColor: "transparent",
              "&:hover": {
                opacity: 0.7,
                backgroundColor: "transparent",
              },
            }}
          >
            <MenuIcon />
          </IconButton>
          <Box
            component="img"
            src="/icon.png"
            alt="Logo"
            sx={{
              height: 50,
              width: "auto",
              ml: 2,
              filter: "drop-shadow(0 2px 4px rgba(33,150,243,0.2))",
            }}
          />
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            background: "#fff",
            color: "#2196f3",
            boxShadow: "2px 0 16px 20px rgba(33,150,243,0.15)", // Shadow xanh base-color
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton sx={{ color: "#2196f3" }} onClick={handleDrawerClose}>
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider sx={{ borderColor: "rgba(255,255,255,0.2)" }} />
        <List>
          {mainMenu.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                component={Link}
                to={item.to}
                sx={{
                  color: "#2196f3",
                  transition: "background 0.2s, color 0.2s",
                  "& .MuiListItemIcon-root": {
                    color: "#2196f3",
                    transition: "color 0.2s",
                  },
                  "&:hover": {
                    background: "#2196f3",
                    color: "#fff",
                    "& .MuiListItemIcon-root": {
                      color: "#fff",
                    },
                  },
                }}
              >
                <ListItemIcon>
                  <FontAwesomeIcon icon={item.icon} />
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider sx={{ my: 2, borderColor: "rgba(33,150,243,0.2)" }} />
        <List>
          {subMenu.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                sx={{
                  color: "#2196f3",
                  transition: "background 0.2s, color 0.2s",
                  "& .MuiListItemIcon-root": {
                    color: "#2196f3",
                    transition: "color 0.2s",
                  },
                  "&:hover": {
                    background: "#2196f3",
                    color: "#fff",
                    "& .MuiListItemIcon-root": {
                      color: "#fff",
                    },
                  },
                }}
              >
                <ListItemIcon>
                  <FontAwesomeIcon icon={item.icon} />
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        {/* Nút Logout */}
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            p: 2,
            bgcolor: "transparent",
            textAlign: "center",
          }}
        >
          <ListItemButton
            sx={{
              bgcolor: "#e53935",
              color: "#fff",
              borderRadius: 2,
              "&:hover": {
                bgcolor: "#b71c1c",
              },
              justifyContent: "center",
            }}
            onClick={() => {
              // Xử lý logout tại đây
              localStorage.clear();
              window.location.href = "/login";
            }}
          >
            <ListItemIcon sx={{ color: "#fff", minWidth: 0, mr: 1 }}>
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M16 13v-2H7V8l-5 4 5 4v-3h9zm3-10H5c-1.1 0-2 .9-2 2v6h2V5h14v14H5v-6H3v6c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"
                />
              </svg>
            </ListItemIcon>
            <ListItemText primary="Logout" sx={{ textAlign: "center" }} />
          </ListItemButton>
        </Box>
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
        {/* Hiển thị nội dung con */}
        {children}
      </Main>
    </Box>
  );
}
