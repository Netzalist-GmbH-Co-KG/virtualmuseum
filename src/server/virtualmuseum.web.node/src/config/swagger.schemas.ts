/**
 * @swagger
 * components:
 *   schemas:
 *     Tenant:
 *       type: object
 *       properties:
 *         Id:
 *           type: string
 *           format: uuid
 *         Name:
 *           type: string
 *       required:
 *         - Id
 *         - Name
 * 
 *     Room:
 *       type: object
 *       properties:
 *         Id:
 *           type: string
 *           format: uuid
 *         TenantId:
 *           type: string
 *           format: uuid
 *         Label:
 *           type: string
 *           nullable: true
 *         Description:
 *           type: string
 *           nullable: true
 *       required:
 *         - Id
 *         - TenantId
 * 
 *     InventoryItem:
 *       type: object
 *       properties:
 *         Id:
 *           type: string
 *           format: uuid
 *         RoomId:
 *           type: string
 *           format: uuid
 *         Name:
 *           type: string
 *           nullable: true
 *         Description:
 *           type: string
 *           nullable: true
 *         InventoryType:
 *           type: integer
 *         PositionX:
 *           type: number
 *         PositionY:
 *           type: number
 *         PositionZ:
 *           type: number
 *         RotationX:
 *           type: number
 *         RotationY:
 *           type: number
 *         RotationZ:
 *           type: number
 *         ScaleX:
 *           type: number
 *         ScaleY:
 *           type: number
 *         ScaleZ:
 *           type: number
 *       required:
 *         - Id
 *         - RoomId
 *         - InventoryType
 *         - PositionX
 *         - PositionY
 *         - PositionZ
 *         - RotationX
 *         - RotationY
 *         - RotationZ
 *         - ScaleX
 *         - ScaleY
 *         - ScaleZ
 * 
 *     RoomWithInventory:
 *       allOf:
 *         - $ref: '#/components/schemas/Room'
 *         - type: object
 *           properties:
 *             inventoryItems:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/InventoryItem'
 * 
 *     TenantWithRooms:
 *       allOf:
 *         - $ref: '#/components/schemas/Tenant'
 *         - type: object
 *           properties:
 *             rooms:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/RoomWithInventory'
 */
