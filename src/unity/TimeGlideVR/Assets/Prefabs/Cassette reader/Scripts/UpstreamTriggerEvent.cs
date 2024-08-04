using System.Collections;
using System.Collections.Generic;
using System.Threading.Tasks;
using UnityEngine;
using UnityEngine.Events;

public class UpstreamTriggerEvent : MonoBehaviour
{
    [SerializeField]
    private UnityEvent<GameObject> onTriggerEnterEvent;
    [SerializeField]
    private UnityEvent<GameObject> onTriggerExitEvent;

    private bool exitDelay = false;
    // Start is called before the first frame update
    private void OnTriggerEnter(Collider other){
        if(exitDelay) return;
        onTriggerEnterEvent.Invoke(other.gameObject);
        StartCoroutine(ExitDelay());
    }

    private void OnTriggerExit(Collider other){
        if(exitDelay) return;
        onTriggerExitEvent.Invoke(other.gameObject);
    }

    public void ResetDelay(){
        StartCoroutine(ExitDelay());
    }

    private IEnumerator ExitDelay(){
        exitDelay = true;
        yield return new WaitForSeconds(0.5f);
        exitDelay = false;
    }
}
