using System.Collections;
using System.Collections.Generic;
using System.Drawing;
using System.Threading.Tasks;
using OVR.OpenVR;
using UnityEngine;

public class TableCoordinates : MonoBehaviour
{
    private CSVInterpreter cSVInterpreter;
    
    public void Begin()
    {
        cSVInterpreter = GameObject.FindGameObjectWithTag("InputsAndLogic").GetComponent<CSVInterpreter>();
        var temp = GetComponent<MeshFilter>();
        Vector3 vert1 = temp.mesh.vertices[0];
        Vector3 vert2 = temp.mesh.vertices[temp.mesh.vertices.Length - 1];
        Vector4 globalOffsetToTable = transform.parent.position;
        Debug.Log("globalOffsetToTable: " + globalOffsetToTable);
        var v = transform.localToWorldMatrix * vert1 + globalOffsetToTable;
        vert1 = v;
        vert1.y = transform.position.y;
        v = transform.localToWorldMatrix * vert2 + globalOffsetToTable;
        vert2 = v;
        vert2.y = transform.position.y;

        if(DemoStartScript.demo){
            Debug.Log("Only loaded Arnstadt, since we are in demo mode");
            Debug.Log(vert1 + " vert1, " + vert2 + " vert2");
            Vector3 middle = Vector3.Lerp(vert1, vert2, 0.5f);
            GameObject point = Instantiate(cSVInterpreter.pointPrefab);
            //hacky positioning but hey im tired
            middle.y = 0.8f;
            point.transform.position = middle;
            new StandardFlag(704, middle, point.transform, UnityEngine.Color.red, "Arnstadt", "Im Ilm Kreis");
            GameObject.FindGameObjectWithTag("DemoUI").transform.GetChild(0).gameObject.SetActive(true);
            return;
            //704;Arnstadt;Ilm-Kreis;50.798675991743565;11.2925456440291
        }

        
        cSVInterpreter.UpdateDesiredCorners(vert1, vert2);
        cSVInterpreter.CalculateStuff();
        
    }
}
