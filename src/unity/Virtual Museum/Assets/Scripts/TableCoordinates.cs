using System.Collections;
using System.Collections.Generic;
using System.Threading.Tasks;
using OVR.OpenVR;
using UnityEngine;

public class TableCoordinates : MonoBehaviour
{
    private CSVInterpreter cSVInterpreter;
    
    public void Begin()
    {
        var temp = GetComponent<MeshFilter>();
        Vector3 vert1 = temp.mesh.vertices[0];
        Vector3 vert2 = temp.mesh.vertices[temp.mesh.vertices.Length - 1];
        Vector4 globalOffsetToTable = transform.parent.position;
        var v = transform.localToWorldMatrix * vert1 + globalOffsetToTable;
        vert1 = v;
        vert1.y = transform.position.y;
        v = transform.localToWorldMatrix * vert2 + globalOffsetToTable;
        vert2 = v;
        vert2.y = transform.position.y;
        cSVInterpreter = GameObject.FindGameObjectWithTag("InputsAndLogic").GetComponent<CSVInterpreter>();
        cSVInterpreter.UpdateDesiredCorners(vert1, vert2);
        cSVInterpreter.CalculateStuff();
        
    }
}
