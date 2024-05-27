import axios from "axios";
import { baseURL } from "../constants";

const baseName = 'action/'

export const fetchCategories = (parentId = null) => {
    return new Promise((resolve, reject) => {
        let url = baseURL + baseName +"fetch-all-categories";
        if(parentId) {
            url = url + "?parentId="+parentId
        }
        axios.get(url,{ withCredentials: true }).then(res => resolve(res.data)).catch(err => reject(err.response.data))
    })
}

export const createCategory = (name = "",parentId = null) => {
    return new Promise((resolve, reject) => {
        let url = baseURL + baseName +"create-category";
        let data = {cat_name : name}
        if(parentId) {
            data["parentId"]=parentId
        }
        axios.post(url,data,{ withCredentials: true }).then(res => resolve(res.data)).catch(err => reject(err.response.data))
    })
}

export const deleteCategory = (id = null) => {
    return new Promise((resolve, reject) => {
        let url = baseURL + baseName +"delete-category/"+id;
        axios.delete(url,{ withCredentials: true }).then(res => resolve(res.data)).catch(err => reject(err.response.data))
    })
}

export const editCategory = (name = "",id = null) => {
    return new Promise((resolve, reject) => {
        let url = baseURL + baseName +"update-category/" + id;
        let data = {name : name}
        axios.put(url,data,{ withCredentials: true }).then(res => resolve(res.data)).catch(err => reject(err.response.data))
    })
}