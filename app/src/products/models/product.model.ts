export interface CreateProductRequest{
    name:string
    sku:string
    categoryId:number
    description:string
    regularPrice:number
    offerPrice?:number
    initialStock:number
    minStockeAlert:number

}

export interface CreateProductResponse{
    id:number
    name:string
    categoryId:number
    description:string
    regularPrice:number
    offerPrice?:number
    initialStock:number
    minStockeAlert:number
    createAt?:string
    updatedAt?:string
}