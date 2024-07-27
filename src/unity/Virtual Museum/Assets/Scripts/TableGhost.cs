using Oculus.Interaction.Input;
using UnityEngine;
using UnityEngine.InputSystem;

public class TableGhost : MonoBehaviour
{
    [SerializeField] private OVRCameraRig cameraRig;
    [SerializeField] private Hand rightHand;
    [SerializeField] private GameObject tableGhost;
    private GameObject tableInstance;
    public bool ghost;

    private Vector2 movementVector;

    public void SpawnTableGhost()
    {
        if (rightHand.GetFingerIsPinching(HandFinger.Index)) return;
        if (ghost)
        {
            TableSpawn.instance.CreateSpatialAnchor();
            DestroyTableGhost();
            return;
        }

        var forwardPos = cameraRig.centerEyeAnchor.position + cameraRig.centerEyeAnchor.forward;
        tableInstance = Instantiate(tableGhost, forwardPos, Quaternion.identity);
        /*var position = tableInstance.transform.position;
        
        position = new Vector3(position.x, 0f, position.z);
        tableInstance.transform.position = position;*/
        ghost = true;
    }

    public void DestroyTableGhost()
    {
        if (!ghost) return;
        Destroy(tableInstance);
        ghost = false;
    }

    public void MoveGhost(InputAction.CallbackContext context)
    {
        movementVector = context.ReadValue<Vector2>();
    }

    // Update is called once per frame
    void Update()
    {
        if (!ghost) return;
        var headCenter = cameraRig.centerEyeAnchor;
        tableInstance.transform.rotation =
            Quaternion.Euler(0f, headCenter.rotation.eulerAngles.y, 0f);
        var offset = new Vector3(0f, 0f, 2.5f);
        var position = headCenter.position + headCenter.TransformDirection(offset);
        tableInstance.transform.position = new Vector3(position.x, 0f, position.z);
    }

    public Vector3 GetGhostPosition()
    {
        return !tableInstance ? Vector3.zero : new Vector3(tableInstance.transform.position.x, 0f, tableInstance.transform.position.z);
    }

    public Quaternion GetGhostRotation()
    {
        return !tableInstance ? Quaternion.identity : Quaternion.Euler(0f, tableInstance.transform.rotation.eulerAngles.y, 0f);
    }
}
