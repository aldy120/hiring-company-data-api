# Company API
## Interface
| Resource    | Method | Function               | URL                         | Param       |
|-------------|--------|------------------------|-----------------------------|-------------|
| ConpanyInfo | POST   | 新增公司資訊           | /company                    | Company     |
| ConpanyInfo | POST   | 取得符合條件的公司清單 | /company/filter             | Filter      |
| ConpanyInfo | GET    | 取得單一公司資訊       | /company/{_id}              | _id         |
| ConpanyInfo | PUT    | 更新單一公司資訊       | /company/{_id}              | _id         |
| ConpanyInfo | DELETE | 刪除單一公司資訊       | /company/{_id}              | _id         |
| Tag         | POST   | 新增公司標籤           | /company/{_id}/tag          | _id         |
| Tag         | GET    | 取得公司標籤清單       | /company/{_id}/tag          | _id         |
| Tag         | DELETE | 刪除特定公司之特定標籤 | /company/{_id}/tag/{tag_id} | _id, tag_id |
| Tag         | GET    | 取得所有標籤           | /company/tag                |             |
| Tag         | GET    | 取得單一標籤資訊       | /company/tag/{tag_id}       | tag_id      |
| Area        | GET    | 取得鄉鎮市區資料       | /company/area               |             |
| Category    | GET    | 取得產業分類資料       | /company/category           |             |

see [swagger hub](https://swaggerhub.com/apis/lichi.chen/hiring-company_data_api/0.0.1)

## Database
目前資料集為104找公司網路上人人可見的現有公司資料(約30000家)，儲存於Mongo atlas的Free tier資料庫中。

## Getting Started
1. Install swagger-node
```
npm i -g swagger
```

2. Install dependencies
```
npm i 
```

3. Run server
```
swagger project start
```
## Testing
資料庫有設定 IP White List，請先確認是否加入名單。
```
npm test
```
