import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import CheckIcon from "@mui/icons-material/Check";
import { TreeView, TreeItem } from "@mui/x-tree-view";
import { Button, Stack, TextField, Typography } from "@mui/material";
import {
  createCategory,
  deleteCategory,
  editCategory,
  fetchCategories,
} from "../../services/product";
import { getUserInfo, userLogout } from "../../services/auth";
import { useNavigate } from "react-router-dom";

const defaultTheme = createTheme();

const CategoryTree = ({ categories, fetchAllCategories }) => {
  const [newCategoryName, setNewCategoryName] = React.useState("");
  const [editMode, setEditMode] = React.useState(null);
  const [editModeName, setEditModeName] = React.useState("");

  const handleCreateCategory = (event, categoryId) => {
    event.stopPropagation(); // Stop propagation of the click event
    // You can implement the create category logic here
    console.log(
      `Create category "${newCategoryName}" under category "${categoryId}"`
    );
    // Reset the input field after creating the category
    createCategory(newCategoryName, categoryId)
      .then((res) => {
        alert(res.message);
        fetchAllCategories();
      })
      .catch((err) => alert(err.message))
      .finally(() => setNewCategoryName(""));
  };

  const handleEditCategory = (event, categoryId, name = "") => {
    event.stopPropagation(); // Stop propagation of the click event
    setEditMode(categoryId);
    setEditModeName(name);
    // Implement edit logic as needed
    console.log(`Edit category "${categoryId}"`);
  };

  const saveEditedCaterogy = (event) => {
    event.stopPropagation(); // Stop propagation of the click event
    editCategory(editModeName, editMode)
      .then((res) => {
        alert(res.message);
        fetchAllCategories();
      })
      .catch((err) => alert(err.message))
      .finally(() => {
        setEditMode(null);
        setEditModeName("");
      });
  };

  const handleDeleteCategory = (event, categoryId) => {
    event.stopPropagation(); // Stop propagation of the click event
    // Implement delete logic as needed
    console.log(`Delete category "${categoryId}"`);
    if (window.confirm("Confirm Delete!\nPressing okay will lead to deletion of all child nodes.")) {
      deleteCategory(categoryId)
      .then((res) => {
        alert(res.message);
        fetchAllCategories();
      })
      .catch((err) => alert(err.message))
      .finally(() => setNewCategoryName(""));
    }
   
  };

  return (
    <TreeView>
      {categories.map((category) => (
        <TreeItem
          key={category._id}
          itemId={category._id}
          label={
            <div style={{ display: "flex", alignItems: "center" }}>
              <Typography variant="body1">{category.name}</Typography>
              {editMode === category._id ? (
                <>
                  <TextField
                    onChange={(e) => setEditModeName(e.target.value)}
                    label="Edit Category"
                    variant="outlined"
                    size="small"
                    style={{paddingLeft : "10px"}}
                    defaultValue={editModeName}
                    onKeyDown={(e)=>e.stopPropagation()}
                    onClick={(e) => e.stopPropagation()} // Stop propagation of click event
                  />
                  <Button
                    onClick={(e) => saveEditedCaterogy(e)}
                    size="small"
                  >
                    <CheckIcon fontSize="small" />
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={(e) =>
                      handleEditCategory(e, category._id, category.name)
                    }
                    size="small"
                    style={{ marginLeft: "5px" }}
                  >
                    <EditIcon fontSize="small" />
                  </Button>
                  <Button
                    onClick={(e) => handleDeleteCategory(e, category._id)}
                    size="small"
                    color="error"
                    style={{ marginLeft: "5px" }}
                  >
                    <DeleteForeverIcon fontSize="small" />
                  </Button>
                </>
              )}
              {!editModeName && !editMode && (
                <>
                  <TextField
                    defaultValue={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    label="New Category in this node"
                    variant="outlined"
                    size="small"
                    style={{ marginLeft: "10px" }}
                    onKeyDown={(e)=>e.stopPropagation()}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <Button
                    onClick={(e) => handleCreateCategory(e, category._id)}
                    size="small"
                    color="success"
                    style={{ marginLeft: "5px" }}
                  >
                    Create
                  </Button>
                </>
              )}
            </div>
          }
        >
          {category.children.length > 0 && (
            // Recursively render children categories if they exist
            <CategoryTree
              categories={category.children}
              fetchAllCategories={fetchAllCategories}
            />
          )}
        </TreeItem>
      ))}
    </TreeView>
  );
};

export default function MyTreeView() {
  const [treeData, setTreeData] = React.useState([]);
  const [newCategoryName, setNewCategoryName] = React.useState("");
  const navigate = useNavigate()
  const handleCreateCategory = (event, categoryId) => {
    event.stopPropagation(); // Stop propagation of the click event
    createCategory(newCategoryName)
      .then((res) => {
        alert(res.message);
        fetchAllCategories();
      })
      .catch((err) => alert(err.message))
      .finally(() => setNewCategoryName(""));
  };

  const fetchAllCategories = () => {
    fetchCategories()
      .then((res) => setTreeData(res.payload))
      .catch((err) => alert(err.message));
  };

  React.useEffect(() => {
    getUserInfo().then(res =>console.log("User logged in")).catch(err =>navigate("/login"))
    fetchAllCategories();
  }, []);

  const handleLogout = () => {
    userLogout().then(res => navigate('/login')).catch(err => alert("Error!!!"))
  }

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <main>
        <Grid container justifyContent="flex-end">
            <Grid item  sx={{ mt: 5 }}>
            <Button variant="contained" color="primary" onClick={() => handleLogout()}>Logout</Button>
            </Grid>
        </Grid>
          <Grid container spacing={5} sx={{ mt: 15, ml: 10 }}>
            <Stack spacing={2}>
              <CategoryTree
                categories={treeData}
                fetchAllCategories={fetchAllCategories}
              />
              <TextField
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                label="New Category in as main parent node"
                variant="outlined"
                size="small"
                style={{ marginLeft: "10px" }}
                onClick={(e) => e.stopPropagation()}
              />
              <Button
                onClick={(e) => handleCreateCategory(e)}
                size="small"
                color="success"
                style={{ marginLeft: "5px" }}
              >
                Create
              </Button>
            </Stack>
          </Grid>
        </main>
      </Container>
    </ThemeProvider>
  );
}
