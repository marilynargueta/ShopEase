export interface CreateProductRequest{
    name:string
    sku:string
    categoryId:number
    description:string
    regularPrice:number
    offerPrice?:number
    initialStock:number
    minStockAlert:number

}

export interface CreateProductResponse{
    id:number
    name:string
    categoryId:number
    description:string
    regularPrice:number
    offerPrice?:number
    initialStock:number
    minStockAlert:number
    createAt?:string
    updatedAt?:string
}

export interface ProductItem{
    id:number
    categoryId:number
    categoryName:string
    name:string
    description:string
    regularPrice:number
    offerPrice?:number
    minStockAlert:number
    imageUrl?:string
    createdAt?:string
    updatedAt?:string


}