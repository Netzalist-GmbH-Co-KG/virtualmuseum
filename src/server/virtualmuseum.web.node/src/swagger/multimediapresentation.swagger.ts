/**
 * @swagger
 * components:
 *   schemas:
 *     MediaFile:
 *       type: object
 *       properties:
 *         Id:
 *           type: string
 *           format: uuid
 *         Name:
 *           type: string
 *           nullable: true
 *         Description:
 *           type: string
 *           nullable: true
 *         MediaType:
 *           type: integer
 *           enum: [0, 1, 2, 3, 4, 5, 6]
 *         Path:
 *           type: string
 *       required:
 *         - Id
 *         - MediaType
 *         - Path
 * 
 *     PresentationItem:
 *       type: object
 *       properties:
 *         Id:
 *           type: string
 *           format: uuid
 *         Name:
 *           type: string
 *           nullable: true
 *         Description:
 *           type: string
 *           nullable: true
 *         Order:
 *           type: integer
 *         MediaFileId:
 *           type: string
 *           format: uuid
 *       required:
 *         - Id
 *         - Order
 *         - MediaFileId
 * 
 *     PresentationItemWithMediaFile:
 *       type: object
 *       properties:
 *         Id:
 *           type: string
 *           format: uuid
 *         Name:
 *           type: string
 *           nullable: true
 *         Description:
 *           type: string
 *           nullable: true
 *         Order:
 *           type: integer
 *         MediaFileId:
 *           type: string
 *           format: uuid
 *         MediaFile:
 *           $ref: '#/components/schemas/MediaFile'
 *       required:
 *         - Id
 *         - Order
 *         - MediaFileId
 *         - MediaFile
 * 
 *     MultimediaPresentationWithPresentationItems:
 *       type: object
 *       properties:
 *         Id:
 *           type: string
 *           format: uuid
 *         Name:
 *           type: string
 *           nullable: true
 *         Description:
 *           type: string
 *           nullable: true
 *         PresentationItems:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/PresentationItemWithMediaFile'
 *       required:
 *         - Id
 *         - PresentationItems
*/
