using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using BunnyCDN.Net.Storage.Models;

namespace BunnyCDN.Net.Storage;

public interface IBunnyCDNStorage
{
    /// <summary>
    /// The API access key used for authentication
    /// </summary>
    string ApiAccessKey { get; }

    /// <summary>
    /// The name of the storage zone we are working on
    /// </summary>
    string StorageZoneName { get; }

    /// <summary>
    /// Delete an object at the given path. If the object is a directory, the contents will also be deleted.
    /// </summary>
    /// <param name="path">Path to delete</param>
    /// <returns>Deletion success</returns>
    Task<bool> DeleteObjectAsync(string path);

    /// <summary>
    /// Get the list of storage objects on the given path
    /// </summary>
    /// <param name="path">Path to retrieve objects from</param>
    /// <returns>Path's storage objects</returns>
    Task<List<StorageObject>> GetStorageObjectsAsync(string path);

    /// <summary>
    /// Upload an object from a stream (missing path will be created)
    /// </summary>
    /// <param name="stream">Stream containing file contents</param>
    /// <param name="path">Destination path</param>
    /// <param name="sha256Checksum">The SHA256 checksum of the uploaded content. The server will compare the final SHA256 to the 
    /// checksum and reject the request in case the checksums do not match (ignored if left blank).</param>
    /// <param name="contentTypeOverride">If set to a non-empty value, the value will override the default Content-Type of the file
    Task UploadAsync(Stream stream, string path, string sha256Checksum = null, string contentTypeOverride = "");

    /// <summary>
    /// Upload an object from a stream (missing path will be created)
    /// </summary>
    /// <param name="stream">Stream containing file contents</param>
    /// <param name="path">Destination path</param>
    /// <param name="validateChecksum">Generate the SHA256 checksum of the uploading content and append to request for server-side verification.</param>
    /// <param name="sha256Checksum">The SHA256 checksum of the uploaded content. The server will compare the final SHA256 to the 
    /// checksum and reject the request in case the checksums do not match (will be generated if left null & validateChecksum is true).</param>
    /// <param name="contentTypeOverride">If set to a non-empty value, the value will override the default Content-Type of the file
    Task UploadAsync(Stream stream, string path, bool validateChecksum, string sha256Checksum = null, string contentTypeOverride = "");

    /// <summary>
    /// Upload a local file to the storage
    /// </summary>
    /// <param name="localFilePath">Local path of file to upload</param>
    /// <param name="path">Destination path</param>
    /// <param name="sha256Checksum">The SHA256 checksum of the uploaded content. The server will compare the final SHA256 to the 
    /// checksum and reject the request in case the checksums do not match (will be generated if left null & validateChecksum is true).</param>
    /// <param name="contentTypeOverride">If set to a non-empty value, the value will override the default Content-Type of the file
    Task UploadAsync(string localFilePath, string path, string sha256Checksum = null, string contentTypeOverride = "");

    /// <summary>
    /// Upload a local file to the storage
    /// </summary>
    /// <param name="localFilePath">Local path of file to upload</param>
    /// <param name="path">Destination path</param>
    /// <param name="validateChecksum">Generate a SHA256 checksum of the uploaded content and append to request for server-side verification.</param>
    /// <param name="sha256Checksum">The SHA256 checksum of the uploaded content. The server will compare the final SHA256 to the 
    /// checksum and reject the request in case the checksums do not match (will be generated if left null & validateChecksum is true).</param>
    /// <param name="contentTypeOverride">If set to a non-empty value, the value will override the default Content-Type of the file
    Task UploadAsync(string localFilePath, string path, bool validateChecksum, string sha256Checksum = null, string contentTypeOverride = "");

    /// <summary>
    /// Download the object to a local file
    /// </summary>
    /// <param name="path">Source path to download from</param>
    /// <param name="localFilePath">Local path to download file to</param>
    Task DownloadObjectAsync(string path, string localFilePath);

    /// <summary>
    /// Return a stream with the contents of the object
    /// </summary>
    /// <param name="path">Source path to download from</param>
    /// <returns>Stream containing the file contents</returns>
    Task<Stream> DownloadObjectAsStreamAsync(string path);

    /// <summary>
    /// Normalize a path string
    /// </summary>
    /// <returns>Recognizable, valid string for use against API calls</returns>
    string NormalizePath(string path, bool? isDirectory = null);
}