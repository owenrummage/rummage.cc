---
layout: post
category: example
---
So recently I was looking at some old code and found some Kubernetes deployment files from a few years ago. This has made me want to go deploy Kubernetes again and see why I was so obsessed with it in 2020/2021.

### What is K3s?
K3s is a slimmed down version of K8s (Kubernetes). Its built to run on something like a Raspberry Pi or a small VPS. I will be installing it on a Linode VPS.

Installing K3s on the server
First you want to login to your server and run this command.
```
$ curl -sfL https://get.k3s.io | sh -
```

This command installs K3s on the server in question and sets up all of the dependencies. This will also give you access to Kubectl

### Checking the status
Next, we want to confirm that the cluster installed with no issues. If the above command finished with no errors it probably did, but lets make sure. We can run this command to get a list of all nodes in the cluster and their states.
```
$ kubectl get nodes
```
This is the expected output, as you can see I have one node that has been up for 12 hours called “k3s-linode” and its state is “ready”. The state ready thing is what we need to focus on.

```
NAME         STATUS   ROLES                  AGE   VERSION
k3s-linode   Ready    control-plane,master   13h   v1.28.7+k3s1
```
### Installing Longhorn
Dependencies
First step is you want to make sure you have open-iscsi installed. This can be done (on debian at least) by issuing the following command
```
$ sudo apt-get install open-iscsi
```
### Setting up Helm
Once you have that done, you want to tell helm to add the chart. (Please note you will need to install Helm on your server, instructions may vary depending on operating system).
```
$ helm repo add longhorn https://charts.longhorn.io && helm repo update
```

### Creating the Namespace
Longhorn will need a place to live, we can make the namespace with the following command
```
$ kubectl create namespace longhorn-system
```
### Final Installation
Once we have done all of the previous commands, we can tell Helm to install longhorn for us. We do this by running this command

```
$ helm upgrade -i longhorn longhorn/longhorn —namespace longhorn-system
```

### Configuring default storage class
By default K3s ships with a storage class called local-path, we need to tell K3s that it should ignore that and instead use the longhorn storage class for all PVC requests. This can be done by a process called “patching” where we tell K3s to change metadata of the provider. TL;DR run this command (copied command might have malformed json because of the ” and ’ characters depending on browser font and they may need to be replaced by hand)

```
$ kubectl patch storageclass local-path -p ’{“metadata”:{“annotations”:{“storageclass.kubernetes.io/is-default-class”:“false”}}}‘
```

### Setting up Dashboard access
Finally, you probably want to be able to access the dashboard. There are a few ways to do it, but we are going to do the easiest. This way port forwards from the cluster to your local computer, but it DOES NOT expose it to the public internet.

```
$ kubectl port-forward -n longhorn-system svc/longhorn-frontend 8080:80
```

Once you do that head over to localhost:8080 and you should see the Longhorn dashboard. From there you can do configuration changes as required.

### Conclusion
K3s is cool, use it. Kthxbye