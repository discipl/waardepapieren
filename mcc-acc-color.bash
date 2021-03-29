#! /bin/bash

# osxs-mbp:mcc-acc osx$ . mcc-acc-color.bash 
# Een virtueel netwerk maken met een site-naar-site-VPN-verbinding met CLI
# https://docs.microsoft.com/nl-nl/azure/vpn-gateway/vpn-gateway-howto-site-to-site-resource-manager-cli

# ----------------------------------
# https://docs.microsoft.com/en-us/azure/virtual-network/cli-samples
# ----------------------------------

# define your feedback here

# Variables for Gremlin API resources
UNIQUEID=$RANDOM    

#|Example |values |
#|-----------------------|------------------|
#|VnetName                | TestVNet1 |
#|ResourceGroup           | TestRG1 |
#|Location                | eastus |
#|AddressSpace            | 10.11.0.0/16 |
#|SubnetName              | Subnet1 |
#|Subnet                  | 10.11.0.0/24 |
#|GatewaySubnet           | 10.11.255.0/27 |
#|LocalNetworkGatewayName | Site2 |
#|LNG Public IP           | VPN device IP address 85.195.100.248|
#|LocalAddrPrefix1        | 10.0.0.0/24|
#|LocalAddrPrefix2        | 20.0.0.0/24   |
#|GatewayName             | VNet1GW |
#|PublicIP                | VNet1GWIP |
#|VPNType                 | RouteBased |
#|GatewayType             | Vpn |
#|ConnectionName          | VNet1toSite2|


##################################################################
# Purpose: Azure Virtual Network (VNet) 
# Arguments: https://docs.microsoft.com/en-us/azure/virtual-network/quick-create-portal
# Return: 
# Select Next: IP Addresses, and for IPv4 address space, enter 10.1.0.0/16.
# Select Add subnet, then enter myVirtualSubnet for Subnet name and 10.1.0.0/24 for Subnet address range.
# Select Add, then select Review + create. Leave the rest as default and select Create.
# In Create virtual network, select Create.
##################################################################


ResourceGroup1="mcc-acc-vpnbelastingdienst"             # ResourceGroup=$AZ_RESOURCE_GROUP
Location1="westeurope"                                  # Location=westeurope
VnetName1="MccAccVPNBelastingdienstVNet1"               # VnetName=TestVNet1                        
AddressSpace1="192.168.0.0/16"                          #"10.1.0.0/16"    # AddressSpace=10.11.0.0/16
SubnetName1="MccAccVPNbelastingdienstSubnet1"           # SubnetName=Subnet1
Subnet1="192.168.19.0/24"                               #"10.1.0.0/24"   # Subnet=10.11.0.0/24
VMName1="MccAccVPNBelastingdienstVM1"

ResourceGroup2="mcc-acc-splunk"                         # ResourceGroup=$AZ_RESOURCE_GROUP
Location2="westeurope"                                  # Location=westeurope
VnetName2="MccAccSplunkVNet2"                           # VnetName=TestVNet1                        
AddressSpace2="10.2.0.0/16"                             # AddressSpace=10.11.0.0/16
SubnetName2="MccAccSplunkSubnet2"                       # SubnetName=Subnet1
Subnet2="10.2.0.0/24"                                   # Subnet=10.11.0.0/24
VMName2="MccAccSplunkVM2"

GatewaySubnet="192.168.255.0/27"                       #"10.1.255.0/27"                          # GatewaySubnet=10.11.255.0/27
LocalNetworkGatewayName="SiteVPNinDMZ"                 # LocalNetworkGatewayName=Site2
LNGPublicIP="85.195.100.248"                           # LNGPublicIP=85.195.100.248
LocalAddrPrefix1="10.252.8.166/32"                     #"192.168.19.0/24"                     # LocalAddrPrefix1=192.168.19.0/24
LocalAddrPrefix2="20.0.0.0/24"                         # LocalAddrPrefix2=20.0.0.0/24
GatewayName="MccAccVPNBelastingdienstVPNVNet1GW"       # GatewayName=VNet1GW
PublicIP="MccAccVPNBelastingdienstVPNVNet1GWIP"        # PublicIP=VNet1GWIP
VPNType="RouteBased"                                   # VPNType=RouteBased
GatewayType="Vpn"                                      # GatewayType=Vpn
ConnectionName="VNet1toSiteVPNinDMZ"                   # ConnectionName=VNet1toSite2
IKEv2_Shared_Key="Hybrid_Cloud_2021_03"                 # --shared-key abc123


DOUBLE_CHECK=true
#WRITE_CODE=true
ASKMENU=false
DELMENU=false
PROMPT=false # echo parameters

-
### barf
enter_cont() {
    LOG_START_DATE_TIME=`date +%Y%m%d_%H_%M`
    
    #echo -e "\033[1;37mWHITE"
    #echo -e "\033[0;30mBLACK"
    #echo -e "\033[0;34mBLUE"
    #echo -e "\033[0;32mGREEN"
    #echo -e "\033[0;36mCYAN"
    #echo -e "\033[0;31mRED"
    #echo -e "\033[0;35mPURPLE"
    #echo -e "\033[0;33mYELLOW"
    #echo -e "\033[1;30mGRAY"
    #echo -e "\033[1;30m $LOG_START_DATE_TIME"
    echo -ne "\033[0;33m $LOG_START_DATE_TIME Press enter to Continue"
    read
}

##################################################################
# Purpose: show bash parameters
# Arguments:
# Return:
##################################################################
show_parameters(){
clear
echo -e "\033[0;34m ResourceGroup1="${ResourceGroup1}        # mcc-acc-vpnbelastingdienst
echo  "Location1="${Location1}                               # westeurope
echo  "VnetName1="${VnetName1}                               # TestVNet1
echo  "AddressSpace1="${AddressSpace1}                       # 10.11.0.0/16
echo  "SubnetName1="${SubnetName1}                           # Subnet1
echo  "Subnet1="${Subnet1}                                   # 10.11.0.0/24
echo  "VMName1="${VMName1}                                   # Ubuntu18 
echo -e "\033[1;30 "

echo -e "\033[0;34m ResourceGroup2="${ResourceGroup2}                     # mcc-acc-splunk
echo  "Location2="${Location2}                               # westeurope
echo  "VnetName2="${VnetName2}                               # TestVNet1
echo  "AddressSpace2="${AddressSpace2}                       # 10.11.0.0/16
echo  "SubnetName2="${SubnetName2}                           # Subnet1
echo  "Subnet2="${Subnet2}                                   # 10.11.0.0/24
echo  "VMName2="${VMName2}                                   # RedHat8
echo -e "\033[1;30m ~~~~~~~~~~~~~~~~~~~~~"
echo  "GatewaySubnet="${GatewaySubnet}                       # 10.11.255.0/27
echo  "LocalNetworkGatewayName="${LocalNetworkGatewayName}   # Site2
echo  "LNGPublicIP="${LNGPublicIP}                           # 85.195.100.248
echo  "LocalAddrPrefix1="${LocalAddrPrefix1}                 # 10.0.0.0/24
echo  "LocalAddrPrefix2="${LocalAddrPrefix2}                 # 20.0.0.0/24
echo  "GatewayName="${GatewayName}                           # VNet1GW
echo  "PublicIP="${PublicIP}                                 # VNet1GWIP
echo  "VPNType="${VPNType}                                   # RouteBased
echo  "GatewayType="${GatewayType}                           # Vpn
echo  "ConnectionName="${ConnectionName}                     # VNet1toSite2

enter_cont
clear
}

##################################################################
# Purpose: show main menu
# Arguments:
# Return:
##################################################################
show_main_menu(){
clear
# A menu driven shell script
# A menu is nothing but a list of commands presented to a user by a shell script"

# ----------------------------------
# Step: User defined function  10 20 30 ( 40 50)
# ----------------------------------
pause(){
  read -p "Press [Enter] key to continue..." fackEnterKey
}
# function to display menus
show_menus() {
  clear
  echo -e "\033[0;31m  M A I N - M E N U  ${ResourceGroup1}  ${ResourceGroup2} $(date +%D) "
  echo -e "\033[1;30m ~~~~~~~~~~~~~~~~~~~~~"
  echo -e "\033[1;30m #1 Maak verbinding met uw abonnement"
  echo -e "\033[0;34m 0.  Az-Login -u  ${az_user} -p ${az_password}  "
  echo -e "\033[1;30m #2 een resource groep maken"
  echo -e "\033[0;34m  1.  Az-ResourceGroup1_Create : ${ResourceGroup1} "
  echo -e "\033[0;34m  2.  Az-ResourceGroup2_Create : ${ResourceGroup2} "
  echo -e "\033[1;30m #3 een virtueel netwerk maken" 
  echo -e "\033[0;34m  3.  Az-VNet1-Create : ${ResourceGroup1} : ${VnetName1} ${AddressSpace1}  ${SubnetName1} ${Subnet1} " 
  echo -e "\033[0;34m  4.  Az-VNet2-Create : ${ResourceGroup2} : ${VnetName2} ${AddressSpace2}  ${SubnetName2} ${Subnet2} " 
  echo -e "\033[1;30m # Peering the Netwerken"
  echo -e "\033[0;34m  5.  Az-Network-Vnet-Peering-Create : ${ResourceGroup1}  ${VnetName1}  <=>   ${ResourceGroup2}  ${VnetName2} "
  echo -e "\033[1;30m #4 het gateway-subnet maken"
  echo -e "\033[0;34m  6.  Az-Network-Vnet-GatewaySubnet-Create : ${ResourceGroup1} gatewaysubnet ${VnetName1} ${GatewaySubnet} " 
  echo -e "\033[1;30m #5 de lokale netwerk gateway maken"
  echo -e "\033[0;34m  7.  Az-Network-Local-gateway-Create : ${ResourceGroup1}  ${LocalNetworkGatewayName} ${LNGPublicIP}   ${LocalAddrPrefix1}"
  echo -e "\033[1;30m #6  een openbaar IP-adres aanvragen"
  echo -e "\033[0;34m  8.  Az-Network-Public-ip-Create : ${ResourceGroup1} ${PublicIP} " 
  echo -e "\033[1;30m ~~~~~~~~~~~~~~~~~~~~~"
  echo -e "\033[1;30m #7. de VPN-gateway maken 45 minutes"
  echo -e "\033[0;34m  9.  Az-Network-Vnet-Gateway-Create :  ${GatewayName} ${PublicIP}  ${ResourceGroup1}  ${VnetName1} " # ${GatewayType} ${VPNType} " 
  echo -e "\033[1;30m #8  uw VPN-apparaat configureren"
  echo -e "\033[0;34m  10. Az-Network-Vpn-connection-Create:  ${ConnectionName}  ${ResourceGroup1} ${GatewayName}  ${IKEv2_Shared_Key} ${LocalNetworkGatewayName}"   
  echo -e "\033[1;30m ~~~~~~~~~~~~~~~~~~~~~"
  echo -e "\033[0;34m  11. Az-VM1_Create : ${ResourceGroup1} : ${VMName1} " 
  echo -e "\033[0;34m  12  Az-VM2-Create : ${ResourceGroup2} : ${VMName2} " 
  echo -e "\033[1;30m ~~~~~~~~~~~~~~~~~~~~~"
  echo -e "\033[0;34m  13. az-vm-open-port-8000 : ${ResourceGroup2} : ${VMName2} --priority 1010" 
  echo -e "\033[0;34m  14  az-vm-open-port-9997 : ${ResourceGroup2} : ${VMName2} --priority 1020" 
  

if [ ${DELMENU} = true ]
 then
  echo -e "\033[0;34m  23. Az-ResourceGroup1_Delete : ${ResourceGroup1}   "
  echo -e "\033[0;34m  24. Az-ResourceGroup2_Delete : ${ResourceGroup2}    "
  echo -e "\033[0;34m  25. Az-VNet1-Delete : ${ResourceGroup1} : ${VnetName1}   " 
  echo -e "\033[0;34m  26. Az-VNet2-Delete : ${ResourceGroup2} : ${VnetName2}    " 
  echo -e "\033[0;34m  27. Az-VM1-Delete : ${ResourceGroup1} : ${VMName1}  " 
  echo -e "\033[0;34m  28. Az-VM2-Delete : ${ResourceGroup2} : ${VMName2}    " 
  echo -e "\033[0;34m  29. Az-Network-Vnet-GatewaySubnet-Delete   ${ResourceGroup1} ${VnetName1} ${GatewaySubnet}       " 
  echo -e "\033[0;34m  30. Az-Network-Public-ip-Delete  ${ResourceGroup1} ${PublicIP}        " 
  echo -e "\033[0;34m  31. Az-Network-Local-gateway-Delete ${ResourceGroup1}    ${LocalNetworkGatewayName}   " 
  echo -e "\033[0;34m  32. Az-Network-Vnet-Gateway-Delete  ${GatewayName} ${PublicIP}  ${ResourceGroup1}  ${VnetName1}     " 
  echo -e "\033[0;34m  33. Az-Network-Vpn-connection-Delete  ${ConnectionName}  ${ResourceGroup1} ${GatewayName}  ${IKEv2_Shared_Key} ${LocalNetworkGatewayName}    " 
fi 

  echo -e "\033[1;30m ~~~~~~~~~~~~~~~~~~~~~"
  echo -e "\033[1;30m  90. show_parameters            "

}
# read input from the keyboard and take a action
# invoke the one() when the user select 1 from the menu option.
# invoke the two() when the user select 2 from the menu option.
# Exit when user the user select 100 form the menu option.


read_options(){
	local choice
	read -p "Enter choice [ 1 - 99] " choice
	case $choice in

        0) Az-Login                              ;;
        1) Az-ResourceGroup1_Create              ;;
        2) Az-ResourceGroup2_Create              ;;
        3) Az-VNet1-Create                       ;; 
        4) Az-VNet2-Create                       ;; 
        5) Az-Network-Vnet-Peering-Create        ;;
        6) Az-Network-Vnet-GatewaySubnet-Create  ;; 
        7) Az-Network-Local-gateway-Create       ;; 
        8) Az-Network-Public-ip-Create           ;; 
        9) Az-Network-Vnet-Gateway-Create        ;;  #45 minuten
        10) Az-Network-Vpn-connection-Create     ;;  ## shared secret
        11) Az-VM1_Create                        ;; 
        12) Az-VM2-Create                        ;; 
        13) az-vm-open-port-8000                 ;;
        14) az-vm-open-port-9997                 ;; 
        23) Az-ResourceGroup1_Delete             ;;
        24) Az-ResourceGroup2_Delete             ;;
        25) Az-VNet1-Delete                      ;; 
        26) Az-VNet2-Delete                      ;; 
        27) Az-VM1-Delete                        ;; 
        28) Az-VM2-Delete                        ;; 
        29) Az-Network-Vnet-GatewaySubnet-Delete ;; 
        30) Az-Network-Public-ip-Delete          ;; 
        31) Az-Network-Local-gateway-Delete      ;; 
        32) Az-Network-Vnet-Gateway-Delete       ;; 
        33) Az-Network-Vpn-connection-Delete     ;; 
        90) show_parameters                      ;;           
        99) Exit                          ;;
		*) echo -e "${RED}Error...${STD}" && sleep 1
	esac
}

# ----------------------------------------------
# Step #3: Trap CTRL+C, CTRL+Z and quit singles
# ----------------------------------------------
#trap '' SIGINT SIGQUIT SIGTSTP

# -----------------------------------
# Step #4: Main logic - infinite loop
# ------------------------------------
while true
do
	show_menus
	read_options
done
}

## below the azure CLI functions 

##################################################################
# Purpose: Maak verbinding met uw abonnement
# Arguments:https://docs.microsoft.com/nl-nl/cli/azure/authenticate-azure-cli
# Return: 1
##################################################################
Az-Login(){
#az login -u <username> -p <password>\
echo -e "sure ? \033[0;31m  az login -u $az_user -p $az_password"
enter_cont
az login -u $az_user -p $az_password
enter_cont
}

##################################################################
# Purpose: Create a resource group
##################################################################
Az-ResourceGroup1_Create (){
echo -e "sure ? \033[0;31m  az group create --name ${ResourceGroup1}  --location ${Location1}"
enter_cont
az group create --name  ${ResourceGroup1} --location ${Location1}
enter_cont
}

##################################################################
# Purpose: When you're done using the virtual network and the VMs, delete the resource group and all of the resources it contains:
# Arguments:
# Return:3
##################################################################
Az-ResourceGroup1_Delete(){
echo -e "sure ? \033[0;31m  az group delete --name  ${ResourceGroup1}"
enter_cont
az group delete -n ${ResourceGroup1}
enter_cont
}

##################################################################
# Purpose: Create a resource group
# Arguments:https://docs.microsoft.com/nl-nl/azure/azure-resource-manager/templates/deploy-cli
# Return: 4  az group create mcc-acc-vpnbelastingdienst --location westeurope
##################################################################
Az-ResourceGroup2_Create(){
echo -e "sure ? \033[0;31m  az group create --name ${ResourceGroup2}  --location ${Location2}"
enter_cont
az group create --name  ${ResourceGroup2} --location ${Location2}
enter_cont
}

##################################################################
# Purpose: When you're done using the virtual network and the VMs, delete the resource group and all of the resources it contains:
# Arguments:
# Return:5
##################################################################
Az-ResourceGroup2_Delete(){
echo -e "sure ? \033[0;31m  az group delete --name ${ResourceGroup2} "
enter_cont
az group delete --name ${ResourceGroup2}
enter_cont
}

##################################################################
# Purpose: Procedure to create a VNET Azure Virtual Network 
# Arguments: https://docs.microsoft.com/en-us/cli/azure/network/vnet?view=azure-cli-latest
# Return:6  az network vnet create --name TestVNet1 --resource-group TestRG1 --address-prefix 10.11.0.0/16 --location westeurope --subnet-name Subnet1 --subnet-prefix 10.11.0.0/24 
##################################################################
Az-VNet1-Create () {
echo -e "sure ? \033[0;31m az network vnet create --name ${VnetName1} --resource-group ${ResourceGroup1} --address-prefix ${AddressSpace1} --location ${Location1} --subnet-name ${SubnetName1} --subnet-prefix ${Subnet1} "
enter_cont
az network vnet create --name ${VnetName1} --resource-group ${ResourceGroup1}  --address-prefix ${AddressSpace1} --location ${Location1} --subnet-name ${SubnetName1} --subnet-prefix ${Subnet1}
enter_cont
}

##################################################################
# Purpose: Procedure to delete a vnet
# Arguments: https://docs.microsoft.com/en-us/cli/azure/network/vnet?view=azure-cli-latest
# Return: ?az network vnet delete --name TestVNet1 --resource-group TestRG1
##################################################################
Az-VNet1-Delete() {
echo -e "sure ? \033[0;31m  az network vnet delete --name ${VnetName1} --resource-group ${ResourceGroup1} "
enter_cont
az network vnet delete --name ${VnetName1} --resource-group ${ResourceGroup1}
enter_cont
}

##################################################################
# Purpose: Procedure to create a VNET Azure Virtual Network 
# Arguments: https://docs.microsoft.com/en-us/cli/azure/network/vnet?view=azure-cli-latest
##################################################################
Az-VNet2-Create () {
echo -e "sure ? \033[0;31m  az network vnet create --name ${VnetName2} --resource-group ${ResourceGroup2} --address-prefix ${AddressSpace12} --location ${Location2} --subnet-name ${SubnetName2} --subnet-prefix ${Subnet2}" 
enter_cont
az network vnet create --name ${VnetName2} --resource-group ${ResourceGroup2}  --address-prefix ${AddressSpace2} --location ${Location2} --subnet-name ${SubnetName2} --subnet-prefix ${Subnet2}
enter_cont
}

##################################################################
# Purpose: Procedure to delete a vnet
# Arguments: https://docs.microsoft.com/en-us/cli/azure/network/vnet?view=azure-cli-latest
# Return:9 ?az network vnet delete --name TestVNet1 --resource-group TestRG1
##################################################################
Az-VNet2-Delete() {
echo -e "sure ? \033[0;31m  az network vnet delete --name ${VnetName2} --resource-group ${ResourceGroup2}"
enter_cont
az network vnet delete --name ${VnetName2} --resource-group ${ResourceGroup2}
enter_cont
}

#######################
# 2 Het gateway-subnet maken 
#######################

Az-Network-Vnet-GatewaySubnet-Create() {
  
echo -e "sure ? \033[0;31m  az network vnet subnet create --address-prefix ${GatewaySubnet} --name GatewaySubnet --resource-group ${ResourceGroup1} --vnet-name ${VnetName1} "
enter_cont 
az network vnet subnet create --address-prefix ${GatewaySubnet} --name GatewaySubnet --resource-group ${ResourceGroup1} --vnet-name ${VnetName1} 
enter_cont
}


#######################
#
#https://docs.microsoft.com/en-us/cli/azure/network/vnet/subnet?view=azure-cli-latest
#######################

Az-Network-Vnet-GatewaySubnet-Delete() {
echo -e "sure ? \033[0;31m az network vnet subnet delete  --name GatewaySubnet --resource-group ${ResourceGroup1} --vnet-name ${VnetName1} "
enter_cont 
az network vnet subnet delete --name GatewaySubnet --resource-group ${ResourceGroup1} --vnet-name ${VnetName1}
enter_cont
}


#######################
#de lokale netwerk gateway maken
# https://docs.microsoft.com/en-us/cli/azure/network/local-gateway?view=azure-cli-latest
#######################

Az-Network-Local-gateway-Create() {
echo -e "sure ? \033[0;31m  az network local-gateway create --gateway-ip-address ${LNGPublicIP} --name ${LocalNetworkGatewayName} --resource-group ${ResourceGroup1} --local-address-prefixes ${LocalAddrPrefix1} "
enter_cont 
az network local-gateway create --name ${LocalNetworkGatewayName}  --gateway-ip-address ${LNGPublicIP} --resource-group ${ResourceGroup1} --local-address-prefixes ${LocalAddrPrefix1}
enter_cont
}

#######################
# de lokale netwerk gateway verwijderen
# https://docs.microsoft.com/en-us/cli/azure/network/local-gateway?view=azure-cli-latest
# De lokale netwerkgateway verwijst doorgaans naar uw on-premises locatie. U geeft de site e
  
Az-Network-Local-gateway-Delete() {
echo -e "sure ? \033[0;31m  az network local-gateway create  --name ${LocalNetworkGatewayName} --resource-group ${ResourceGroup1}  "
enter_cont 
az network local-gateway delete  --name ${LocalNetworkGatewayName} --resource-group ${ResourceGroup1} 
enter_cont
}


#######################
# een openbaar IP-adres aanvragen
# https://docs.microsoft.com/en-us/cli/azure/network/public-ip?view=azure-cli-latest

#######################
Az-Network-Public-ip-Create() {
echo -e "sure ? \033[0;31m  az network public-ip create --name ${PublicIP} --resource-group ${ResourceGroup1} --allocation-method Dynamic"
enter_cont
az network public-ip create --name ${PublicIP} --resource-group ${ResourceGroup1} --allocation-method Dynamic
enter_cont
}

######################
# een openbaar IP-adres aanvragen
# https://docs.microsoft.com/en-us/cli/azure/network/public-ip?view=azure-cli-latest
#######################

Az-Network-Public-ip-Delete () {
echo -e "sure ? \033[0;31m  az network public-ip create --name ${PublicIP} --resource-group ${ResourceGroup1}  "
enter_cont
az network public-ip delete --name ${PublicIP} --resource-group ${ResourceGroup1} 
enter_cont
}

#######################
# de VPN-gateway maken
# https://docs.microsoft.com/en-us/cli/azure/network/vnet-gateway?view=azure-cli-latest
# Maak de VPN-gateway van het virtuele netwerk. Het maken van een VPN-gateway kan 45 minuten of langer duren.
#######################45 MINUTES... 
Az-Network-Vnet-Gateway-Create() {
echo -e "sure 45minutes? \033[0;31m  az network vnet-gateway create --name ${GatewayName} --public-ip-address ${PublicIP} --resource-group ${ResourceGroup1} --vnet ${VnetName1} --gateway-type ${GatewayType} --vpn-type ${VPNType} --sku VpnGw1 --no-wait"
enter_cont 
az network vnet-gateway create \
--name ${GatewayName} \
--resource-group ${ResourceGroup1} \
--public-ip-address ${PublicIP} \
--vnet ${VnetName1} \
--gateway-type ${GatewayType} \
--vpn-type ${VPNType} \
--sku VpnGw1  \
--no-wait  ##45 minutes
enter_cont
}

#######################
# de VPN-gateway verwijderen 
# https://docs.microsoft.com/en-us/cli/azure/network/vnet-gateway?view=azure-cli-latest
#######################

Az-Network-Vnet-Gateway-Delete() {
echo -e "sure ? \033[0;31m  az network vnet-gateway delete --name ${GatewayName} --resource-group ${ResourceGroup1} "
enter_cont 
az network vnet-gateway delete --name ${GatewayName} --resource-group ${ResourceGroup1} 
enter_cont
}

#######################4
# de VPN-connectie maken
# https://docs.microsoft.com/en-us/cli/azure/network/vpn-connection?view=azure-cli-latest
#######################4

Az-Network-Vpn-connection-Create() {
echo -e "sure ? \033[0;31m  az network vpn-connection create --name ${ConnectionName} --resource-group ${ResourceGroup1} --vnet-gateway1 ${GatewayName} -l ${Location1} --shared-key ${IKEv2_Shared_Key} --local-gateway2 ${LocalNetworkGatewayName}"
enter_cont 

az network vpn-connection create \
 --name ${ConnectionName} \
 --resource-group ${ResourceGroup1} \
 --vnet-gateway1 ${GatewayName} \
 --location ${Location1} \
 --shared-key ${IKEv2_Shared_Key} \
 --local-gateway2 ${LocalNetworkGatewayName} 

enter_cont

}
#######################4
# de VPN-verbinding 
# https://docs.microsoft.com/en-us/cli/azure/network/vpn-connection?view=azure-cli-latest
# az network vpn-connection delete -g MyResourceGroup -n MyConnection
#######################4

Az-Network-Vpn-connection-Delete() {
echo -e "sure ? \033[0;31m  az network vpn-connection delete  --name ${ConnectionName} --resource-group ${ResourceGroup1} "
enter_cont 
az network vpn-connection delete --name ${ConnectionName} --resource-group ${ResourceGroup1} 
enter_cont
}



##################################################################
# Purpose: Create Ubuntu VM in the virtual network:
# Arguments:https://docs.microsoft.com/en-us/azure/virtual-network/quick-create-portal
# Return: 
##################################################################

Az-VM1_Create() {
echo -e "sure ? \033[0;31m  az vm create --resource-group ${ResourceGroup1} --name ${VMName1} --image UbuntuLTS  "
enter_cont    

az vm create \
   --resource-group ${ResourceGroup1} \
   --name ${VMName1} \
   --image UbuntuLTS \
   --admin-username "bdmccuser" \
   --generate-ssh-keys \
   --public-ip-address myPublicIpAddress \
   --public-ip-address-allocation static \
   --admin-password "ThisIsCool_2021" 
enter_cont   
}

##################################################################
# Purpose: Procedure to delete a VM
# Arguments: https://docs.microsoft.com/nl-nl/azure/virtual-machines/linux/cli-manage
###################################################################
Az-VM1-Delete() {
echo -e "sure ? \033[0;31m  az vm delete  --resource-group ${ResourceGroup1} --name ${VMName1}    "
enter_cont 
az vm delete  --resource-group ${ResourceGroup1} --name ${VMName1}  
enter_cont
}

##################################################################
# Purpose:Een Linux-VM maken
# Arguments: 
# Return: 
##################################################################

Az-VM2-Create() {
echo -e "sure ? \033[0;31m  az vm create --resource-group ${ResourceGroup2} --name ${VMName2} --image RedHat:rhel-raw:8-raw-gen2:8.0.2021011802   "
enter_cont    

az vm create \
   --resource-group ${ResourceGroup2} \
   --name ${VMName2} \
   --image RedHat:rhel-raw:8-raw-gen2:8.0.2021011802  \
   --admin-username "bdmccuser" \
   --generate-ssh-keys \
   --public-ip-address myPublicIpAddress \
   --public-ip-address-allocation static \
   --admin-password "ThisIsCool_2021" 
enter_cont
}


##################################################################
# Purpose:Een Linux-VM maken
# Arguments: 
# Return: 
##################################################################
az-vm-open-port-8000 () {

echo -e "sure ? \033[0;31m  az vm open-port --resource-group ${ResourceGroup2} --name ${VMName2} --priority 1010--port 8000"
enter_cont
az vm open-port --resource-group ${ResourceGroup2} --name ${VMName2} --priority 1010 --port 8000
enter_cont
}

##################################################################
# Purpose:Een Linux-VM maken
# Arguments: 
# Return: 
##################################################################

az-vm-open-port-9997 () {
echo -e "sure ? \033[0;31m  az vm open-port --resource-group ${ResourceGroup2} --name ${VMName2} --priority 1020 --port 9997"
enter_cont
az vm open-port --resource-group ${ResourceGroup2} --name ${VMName2} --priority 1020 --port 9997  
enter_cont
}  


##################################################################
# Purpose: Procedure to delete a vnet
# Arguments: https://docs.microsoft.com/en-us/azure/virtual-network/scripts/virtual-network-cli-sample-Network-Vnet-Peering-Create
###################################################################
Az-Network-Vnet-Peering-Create(){
echo -e "sure ? \033[0;31m  Peer ${ResourceGroup1} ${VnetName1}  <=>   ${ResourceGroup2}  ${VnetName2} "
enter_cont

# Get the id for VNet1.
VNet1Id=$(az network vnet show \
  --resource-group ${ResourceGroup1} \
  --name ${VnetName1} \
  --query id --out tsv)

enter_cont
# Get the id for VNet2.
VNet2Id=$(az network vnet show \
  --resource-group ${ResourceGroup2} \
  --name ${VnetName2} \
  --query id \
  --out tsv)
enter_cont

# Peer VNet1 to VNet2.
az network vnet peering create \
  --name LinkVnet1ToVnet2 \
  --resource-group ${ResourceGroup1}\
  --vnet-name ${VnetName1} \
  --remote-vnet-id $VNet2Id \
  --allow-vnet-access

enter_cont

# Peer VNet2 to VNet1.
az network vnet peering create \
  --name LinkVnet2ToVnet1 \
  --resource-group ${ResourceGroup2} \
  --vnet-name ${VnetName2} \
  --remote-vnet-id $VNet1Id \
  --allow-vnet-access

enter_cont
}

##################################################################
# Purpose: Een Linux-VM verwijderen
# Arguments: https://docs.microsoft.com/nl-nl/azure/virtual-machines/linux/cli-manager
# Een VM verwijderen	az vm delete --resource-group myResourceGroup --name myVM
###################################################################
Az-VM2-Delete() {
echo -e "sure ? \033[0;31m  az vm delete  --resource-group ${ResourceGroup2} --name ${VMName2}    "
enter_cont 
az vm delete  --resource-group ${ResourceGroup2} --name ${VMName2}  
enter_cont
}


#######################
## M A I N
# program starts here actually
#######################
 
BATCH_START_DATE_TIME=`date +%Y%m%d_%H_%M`
LOG_START_DATE_TIME=`date +%Y%m%d_%H_%M`
LOG_FILE=${LOG_DIR}/LOG_${LOG_START_DATE_TIME}.log
LOG_DIR=${GITHUB_DIR}/LOG_DIR
#create_directories
#create_logdir
clear

echo "***"
echo "***  Welcome to a `uname`   $BATCH_START_DATE_TIME "
echo "***"
echo "***  bfg.bash $@   "

echo -n "Press enter to Continue"

#if [ ${ASKMENU} = true ]
# then
#clear
#while true; do
#    read -p "goto MAIN-MENU (y or n)" yn
#    case $yn in
#          [Yy]* ) show_main_menu ; break;;
#          [Nn]* ) echo "N";  break;;
#        * ) echo "Please answer yes or no.";;
#    esac
#done
#fi

show_main_menu

BATCH_END_DATE_TIME=`date +%Y%m%d_%H_%M`
echo
echo "hope the run will be ok!"
echo


# eof 
