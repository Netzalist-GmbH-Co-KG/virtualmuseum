/**
 * @swagger
 * components:
 *   schemas:
 *     TimeSeries:
 *       type: object
 *       required:
 *         - Id
 *         - Name
 *         - Description
 *       properties:
 *         Id:
 *           type: string
 *           description: The unique identifier of the time series
 *         Name:
 *           type: string
 *           description: The name of the time series
 *         Description:
 *           type: string
 *           description: A description of the time series
 * 
 *     GeoEventGroup:
 *       type: object
 *       required:
 *         - Id
 *         - TimeSeriesId
 *       properties:
 *         Id:
 *           type: string
 *           description: The unique identifier of the geo event group
 *         Label:
 *           type: string
 *           nullable: true
 *           description: The label of the geo event group
 *         Description:
 *           type: string
 *           nullable: true
 *           description: A description of the geo event group
 *         TimeSeriesId:
 *           type: string
 *           description: The ID of the time series this group belongs to
 * 
 *     GeoEvent:
 *       type: object
 *       required:
 *         - Id
 *         - GeoEventGroupId
 *       properties:
 *         Id:
 *           type: string
 *           description: The unique identifier of the geo event
 *         GeoEventGroupId:
 *           type: string
 *           description: The ID of the geo event group this event belongs to
 *         MultimediaPresentationId:
 *           type: string
 *           nullable: true
 *           description: The ID of the multimedia presentation for this event
 *         DateTime:
 *           type: string
 *           description: The date and time of the geo event
 *         Latitude:
 *           type: number
 *           description: The latitude of the geo event
 *         Longitude:
 *           type: number
 *           description: The longitude of the geo event
 *         Label:
 *           type: string
 *           nullable: true
 *           description: The label of the geo event
 *         Description:
 *           type: string
 *           nullable: true
 *           description: A description of the geo event
 * 
 * 
 * 
 *     TimeSeriesWithEvents:
 *       allOf:
 *         - $ref: '#/components/schemas/TimeSeries'
 *         - type: object
 *           properties:
 *             GeoEventGroups:
 *               type: array
 *               items:
 *                 allOf:
 *                   - $ref: '#/components/schemas/GeoEventGroup'
 *                   - type: object
 *                     properties:
 *                       GeoEvents:
 *                         type: array
 *                         items:
 *                           $ref: '#/components/schemas/GeoEvent'
 */
