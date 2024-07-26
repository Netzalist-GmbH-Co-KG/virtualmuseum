using System.Collections;
using TMPro;
using UnityEngine;

public class PopupNotificationHandler : MonoBehaviour
{
    
    public GameObject popupNotification;
    public TMP_Text text;
    private Coroutine deactivateRoutine;
    public void Popup(string message)
    {
        if(deactivateRoutine != null){
            StopCoroutine(deactivateRoutine);
        }
        popupNotification.SetActive(true);
        text.text = message;
        deactivateRoutine = StartCoroutine(Deactivate());
    }

    IEnumerator Deactivate(){
        yield return new WaitForSeconds(3f);
        popupNotification.SetActive(false);
    }
}
