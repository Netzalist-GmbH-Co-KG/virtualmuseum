using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class MoveOverTime : MonoBehaviour
{
    [SerializeField]
    private AnimationCurve velocityOverTimeCurve;
    [SerializeField]
    private float samplePerSecond = 1f;
    
    [SerializeField]
    private bool animateY;

    [SerializeField]
    private bool animateForward;
    public Vector3 direction;
    float time = 0;
    // Start is called before the first frame update

    // Update is called once per frame
    void Update()
    {
        time = (time + Time.deltaTime) % 1;
        float sampleTime = time / samplePerSecond;
        transform.Translate(direction * velocityOverTimeCurve.Evaluate(sampleTime) * Time.deltaTime, Space.World);
    }
}
