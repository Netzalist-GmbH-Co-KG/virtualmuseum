using System.Collections;
using System.Collections.Generic;
using Oculus.Interaction;
using UnityEngine;

public class IntroButton : MonoBehaviour
{
    [SerializeField] private PokeInteractableVisual pokeInteractableVisual;
    public GameObject tableParent;
    private TableSpawn tableSpawnScript;
    private static readonly int Initiate = Animator.StringToHash("Initiate");
    // Start is called before the first frame update
    void Start()
    {
        tableSpawnScript = TableSpawn.instance;
    }

    void Update(){
        if(Input.GetKeyDown(KeyCode.W)){
            DemoButton();
        }
    }

    public void LockButton()
    {
        var obj = pokeInteractableVisual.gameObject;
        var pos = obj.transform.position;
        pokeInteractableVisual.enabled = false;
        obj.transform.position = pos;
        tableSpawnScript.SpawnTableOnAnchor();
        GetComponent<PokeInteractable>().enabled = false;
    }

    public void DemoButton(){
        var obj = pokeInteractableVisual.gameObject;
        var pos = obj.transform.position;
        pokeInteractableVisual.enabled = false;
        obj.transform.position = pos;
        tableParent.GetComponent<Animator>().SetBool(Initiate, true);
        GetComponent<PokeInteractable>().enabled = false;
    }
}
