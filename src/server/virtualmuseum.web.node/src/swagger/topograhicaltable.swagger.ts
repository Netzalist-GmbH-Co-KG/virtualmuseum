/**
 * @swagger
 * components:
 *   schemas:
 *     TopographicalTable:
 *       type: object
 *       required:
 *         - Id
 *       properties:
 *         Id:
 *           type: string
 *           description: The unique identifier of the topographical table
 * 
 *     TopographicalTableTopic:
 *       type: object
 *       required:
 *         - Id
 *         - TopographicalTableId
 *         - Topic
 *       properties:
 *         Id:
 *           type: string
 *           description: The unique identifier of the topographical table topic
 *         TopographicalTableId:
 *           type: string
 *           description: The ID of the topographical table this topic belongs to
 *         Topic:
 *           type: string
 *           description: The topic name
 *         Description:
 *           type: string
 *           nullable: true
 *           description: A description of the topic
 *         MediaFileImage2DId:
 *           type: string
 *           nullable: true
 *           description: The ID of the associated 2D image media file
 * 
 *     TopographicalTopicWithTimeSeries:
 *       allOf:
 *         - $ref: '#/components/schemas/TopographicalTableTopic'
 *         - type: object
 *           properties:
 *             TimeSeries:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TimeSeriesWithEventsAndMultimediaPresentation'
 * 
 *     TopographicalTableWithTopics:
 *       allOf:
 *         - $ref: '#/components/schemas/TopographicalTable'
 *         - type: object
 *           properties:
 *             Topics:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TopographicalTopicWithTimeSeries'
 */