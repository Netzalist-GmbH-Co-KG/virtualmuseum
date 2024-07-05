using System.Collections;
using System.Collections.Generic;
using Oculus.Interaction;
using UnityEngine;

public class IntroButton : MonoBehaviour
{
    [SerializeField] private PokeInteractableVisual pokeInteractableVisual;

    private TableSpawn tableSpawnScript;
    // Start is called before the first frame update
    void Start()
    {
        tableSpawnScript = TableSpawn.instance;
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
}
